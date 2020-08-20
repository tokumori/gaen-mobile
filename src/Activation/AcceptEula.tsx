import React, { useState, FunctionComponent } from "react"
import env from "react-native-config"
import {
  TouchableOpacity,
  Linking,
  StyleSheet,
  View,
  SafeAreaView,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { Icons } from "../assets"
import { GlobalText } from "../components/GlobalText"
import { ActivationScreens } from "../navigation"
import { Button } from "../components/Button"

import {
  Forms,
  Iconography,
  Colors,
  Spacing,
  Outlines,
  Typography,
} from "../styles"
import { useStatusBarEffect } from "../navigation"
import arrow from "../assets/svgs/arrow"
import LinearGradient from "react-native-linear-gradient"

const AcceptEula: FunctionComponent = () => {
  useStatusBarEffect("dark-content")
  const [boxChecked, toggleCheckbox] = useState(false)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressNext = () => {
    navigation.navigate(ActivationScreens.ActivateProximityTracing)
  }

  const linkToPrivacyPolicy = async () => {
    await Linking.openURL(env.PRIVACY_POLICY_URL)
  }

  const linkToEula = async () => {
    await Linking.openURL(env.PRIVACY_POLICY_URL)
  }
  const checkboxIcon = boxChecked
    ? Icons.CheckboxChecked
    : Icons.CheckboxUnchecked

  const checkboxLabel = boxChecked
    ? t("label.checked_checkbox")
    : t("label.unchecked_checkbox")

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      colors={Colors.gradientPrimary10}
      style={style.backgroundGradient}
    >
      <SafeAreaView style={style.container}>
        <GlobalText style={style.headerText}>
          {t("onboarding.terms_header_title")}
        </GlobalText>
        <EulaLink
          docName={t("onboarding.privacy_policy")}
          onPress={linkToPrivacyPolicy}
        />
        <EulaLink docName={t("onboarding.eula")} onPress={linkToEula} />
        <View style={style.footerContainer}>
          <TouchableOpacity
            style={style.checkboxContainer}
            onPress={() => toggleCheckbox(!boxChecked)}
            accessible
            accessibilityRole="checkbox"
            accessibilityLabel={checkboxLabel}
            testID="accept-terms-of-use-checkbox"
          >
            <SvgXml
              xml={checkboxIcon}
              fill={Colors.primary100}
              width={Iconography.small}
              height={Iconography.small}
            />
            <GlobalText style={style.checkboxText}>
              {t("onboarding.eula_agree_terms_of_use")}
            </GlobalText>
          </TouchableOpacity>
          <Button
            onPress={handleOnPressNext}
            disabled={!boxChecked}
            label={t("common.continue")}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

type EulaLinkProps = {
  docName: string
  onPress: () => Promise<void>
}
const EulaLink: FunctionComponent<EulaLinkProps> = ({ docName, onPress }) => {
  const { t } = useTranslation()
  return (
    <TouchableOpacity style={style.eulaLinkContainer} onPress={onPress}>
      <View style={style.eulaTextContainer}>
        <GlobalText style={style.eulaText}>
          {t("onboarding.please_read_the")}
        </GlobalText>
        <GlobalText style={{ ...style.eulaText, ...style.eulaLink }}>
          <> {docName}</>
        </GlobalText>
      </View>
      <SvgXml
        xml={arrow}
        fill={Colors.primary100}
        style={style.eulaLinkArrow}
      />
    </TouchableOpacity>
  )
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    margin: Spacing.xxLarge,
  },
  backgroundGradient: {
    height: "100%",
  },
  headerText: {
    ...Typography.header1,
  },
  eulaLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.small,
    marginTop: Spacing.large,
    backgroundColor: Colors.primaryLightBackground,
    ...Outlines.roundedBorder,
    ...Outlines.baseShadow,
    borderColor: Colors.neutral25,
  },
  eulaTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
  },
  eulaText: {
    ...Typography.largeFont,
  },
  eulaLink: {
    ...Typography.link,
    flexWrap: "wrap",
  },
  eulaLinkArrow: {
    flex: 1,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: Spacing.xxLarge,
    marginHorizontal: Spacing.xLarge,
  },
  checkboxText: {
    ...Forms.checkboxText,
    color: Colors.primaryText,
    flex: 1,
    paddingLeft: Spacing.medium,
    ...Typography.largeFont,
  },
})

export default AcceptEula
