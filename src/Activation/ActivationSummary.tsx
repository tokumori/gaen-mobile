import React, { FunctionComponent } from "react"
import { View, StyleSheet, Image } from "react-native"
import { useTranslation } from "react-i18next"

import { usePermissionsContext } from "../PermissionsContext"
import { useOnboardingContext } from "../OnboardingContext"
import { useApplicationName } from "../More/useApplicationInfo"
import { GlobalText } from "../components"
import { Button } from "../components"

import { Images } from "../assets"
import { Colors, Spacing, Typography } from "../styles"

const NotificationsPermissions: FunctionComponent = () => {
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()
  const { completeOnboarding } = useOnboardingContext()

  const { exposureNotifications } = usePermissionsContext()
  const { status } = exposureNotifications
  const { authorized, enabled } = status

  const isProximityTracingOn = authorized && enabled

  const handleOnPressGoToHome = () => {
    completeOnboarding()
  }

  const handleOnPressActivateProximityTracing = async () => {
    exposureNotifications.request()
    completeOnboarding()
  }

  const image = isProximityTracingOn
    ? Images.CheckInCircle
    : Images.ExclamationInCircle
  const headerText = isProximityTracingOn
    ? t("onboarding.app_setup_complete_header")
    : t("onboarding.app_setup_incomplete_header")
  const bodyText = isProximityTracingOn
    ? t("onboarding.app_setup_complete_body", { applicationName })
    : t("onboarding.app_setup_incomplete_body", { applicationName })

  const Buttons: FunctionComponent = () => {
    return (
      <>
        {isProximityTracingOn ? (
          <Button
            label={t("label.go_to_home_view")}
            onPress={handleOnPressGoToHome}
            customButtonStyle={style.homeButton}
          />
        ) : (
          <>
            <Button
              label={t("label.activate_proximity_tracing")}
              onPress={handleOnPressActivateProximityTracing}
              customButtonStyle={style.activateButton}
            />
            <Button
              label={t("label.go_to_home_view")}
              onPress={handleOnPressGoToHome}
              customButtonStyle={style.homeButton}
              outlined
            />
          </>
        )}
      </>
    )
  }

  return (
    <View style={style.container}>
      <Image source={image} style={style.image} />
      <View style={style.textContainer}>
        <GlobalText style={style.headerText}>{headerText}</GlobalText>
        <GlobalText style={style.bodyText}>{bodyText}</GlobalText>
      </View>
      <Buttons />
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.large,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Colors.primaryLightBackground,
  },
  image: {
    resizeMode: "cover",
    width: 230,
    height: 180,
  },
  textContainer: {
    marginBottom: Spacing.xxLarge,
  },
  headerText: {
    ...Typography.header1,
    textAlign: "center",
    marginBottom: Spacing.medium,
  },
  bodyText: {
    ...Typography.body1,
    textAlign: "center",
  },
  activateButton: {
    width: "100%",
    marginBottom: Spacing.xxSmall,
  },
  homeButton: {
    width: "100%",
  },
})

export default NotificationsPermissions
