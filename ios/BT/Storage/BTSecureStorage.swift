import ExposureNotification
import Foundation
import RealmSwift

final class BTSecureStorage: SafePathsSecureStorage {

  static let shared = BTSecureStorage(inMemory: false)

  override var keychainIdentifier: String {
    "\(Bundle.main.bundleIdentifier!).realm"
  }

  private lazy var realmConfig: Realm.Configuration = {
    guard let realmConfig = getRealmConfig() else {
      fatalError("Missing realm configuration")
    }
    return realmConfig
  }()

  override init(inMemory: Bool = false) {
    super.init(inMemory: inMemory)
    if !userStateExists {
      resetUserState({ _ in })
    }
  }

  override func getRealmConfig() -> Realm.Configuration? {
    if let key = getEncryptionKey() {
      if (inMemory) {
        return Realm.Configuration(inMemoryIdentifier: identifier, encryptionKey: key as Data, schemaVersion: 10,
                                   migrationBlock: { migration, oldVersion in
                                    if oldVersion < 10 {
                                      self.storeExposures(Array(self.userState.exposures))
                                    }
        }, objectTypes: [UserState.self,
                         Exposure.self,
                         ExposureDetectionSummary.self])
      } else {
        return Realm.Configuration(encryptionKey: key as Data, schemaVersion: 10,
                                   migrationBlock: { migration, oldVersion in
                                    if oldVersion < 10 {
                                      self.storeExposures(Array(self.userState.exposures))
                                    }
        }, objectTypes: [UserState.self,
                         Exposure.self,
                         ExposureDetectionSummary.self])
      }
    } else {
      return nil
    }
  }

  var userState: UserState {
    let realm = try! Realm(configuration: realmConfig)
    return realm.object(ofType: UserState.self, forPrimaryKey: 0) ?? UserState()
  }

  var userStateExists: Bool {
    let realm = try! Realm(configuration: realmConfig)
    return realm.object(ofType: UserState.self, forPrimaryKey: 0) != nil
  }

  func setUserValue<Value: Codable>(value: Value, keyPath: String, notificationName: Notification.Name) {
    let realm = try! Realm(configuration: realmConfig)
    try! realm.write {
      realm.create(UserState.self, value: [keyPath: value], update: .modified)
      let jsonString = value.jsonStringRepresentation()
      NotificationCenter.default.post(name: notificationName, object: jsonString)
    }
  }

  func resetUserState(_ completion: ((UserState) -> Void)) {
    guard let realmConfig = getRealmConfig() else {
      return
    }
    let realm = try! Realm(configuration: realmConfig)
    try! realm.write {
      let userState = UserState()
      realm.add(userState, update: .modified)
      completion(userState)
    }
  }

  func storeExposures(_ newExposures: [Exposure]) {
    let realm = try! Realm(configuration: realmConfig)
    newExposures.forEach { exposure in
      try! realm.write {
        realm.add(exposure)
      }
    }
    let jsonString = exposures.jsonStringRepresentation()
    NotificationCenter.default.post(name: .ExposuresDidChange, object: jsonString)
  }

  func storeExposureDetectionSummary(_ summary: ExposureDetectionSummary) {
    let realm = try! Realm(configuration: realmConfig)
    try! realm.write {
      realm.add(summary)
    }
    let jsonString = exposures.jsonStringRepresentation()
    NotificationCenter.default.post(name: .ExposuresDidChange, object: jsonString)
  }

  @Persisted(keyPath: .remainingDailyFileProcessingCapacity, notificationName: .remainingDailyFileProcessingCapacityDidChange, defaultValue: Constants.dailyFileProcessingCapacity)
  var remainingDailyFileProcessingCapacity: Int

  @Persisted(keyPath: .urlOfMostRecentlyDetectedKeyFile, notificationName: .UrlOfMostRecentlyDetectedKeyFileDidChange, defaultValue: .default)
  var urlOfMostRecentlyDetectedKeyFile: String

  var exposures: [Exposure] {
    guard let realmConfig = getRealmConfig() else {
      return []
    }
    let realm = try! Realm(configuration: realmConfig)
    return Array(realm.objects(Exposure.self))
  }

  var exposureDetectionSummaries: [ExposureDetectionSummary] {
    guard let realmConfig = getRealmConfig() else {
      return []
    }
    let realm = try! Realm(configuration: realmConfig)
    return Array(realm.objects(ExposureDetectionSummary.self))
  }

  @Persisted(keyPath: .keyPathdateLastPerformedFileCapacityReset,
             notificationName: .dateLastPerformedFileCapacityResetDidChange, defaultValue: nil)
  var dateLastPerformedFileCapacityReset: Date?

  @Persisted(keyPath: .keyPathHMACKey,
             notificationName: .HMACKeyDidChange, defaultValue: "")
  var HMACKey: String

  @Persisted(keyPath: .revisionToken,
             notificationName: .revisionTokenDidChange, defaultValue: "")
  var revisionToken: String

  @Persisted(keyPath: .keyPathExposureDetectionErrorLocalizedDescription, notificationName:
    .StorageExposureDetectionErrorLocalizedDescriptionDidChange, defaultValue: .default)
  var exposureDetectionErrorLocalizedDescription: String

}

extension BTSecureStorage {

  func pruneOldExposureDetectionSummaries() {
    let realm = try! Realm(configuration: realmConfig)
    try! realm.write {
      let cutoff = Date().posixRepresentation - 1209600 // 2 weeks ago
      let oldSummaries = realm.objects(ExposureDetectionSummary.self).filter("dateReceived > \(cutoff)")
      realm.delete(oldSummaries)
    }
  }

  func sequenceInDayNumber(for posixDate: Int) -> Int {
    let realm = try! Realm(configuration: realmConfig)
    let storedSummariesForDate = realm.objects(ExposureDetectionSummary.self).filter("startOfDateReceived == \(posixDate)")
    return storedSummariesForDate.count
  }

  func allExposureDetectionSummaries() -> [ExposureDetectionSummary] {
    let realm = try! Realm(configuration: realmConfig)
    return realm.objects(ExposureDetectionSummary.self).map { $0 }
  }

}
