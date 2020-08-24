import React, { FunctionComponent, ReactNode } from "react"
import { StyleSheet } from "react-native"

import LinearGradient from "react-native-linear-gradient"

import { Colors } from "../styles"

interface GradientBackgroundProps {
  children: ReactNode
}

const GradientBackground: FunctionComponent<GradientBackgroundProps> = ({
  children,
}) => {
  return (
    <LinearGradient
      colors={Colors.gradientPrimary10}
      style={style.gradient}
      useAngle
      angle={180}
      angleCenter={{ x: 0.5, y: 0.25 }}
    >
      {children}
    </LinearGradient>
  )
}

const style = StyleSheet.create({
  gradient: {
    flex: 1,
  },
})

export default GradientBackground
