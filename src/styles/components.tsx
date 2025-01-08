// Copyright DWJ 2024.
// Distributed under the Boost Software License, Version 1.0.
// https://www.boost.org/LICENSE_1_0.txt

import * as PDF from "@react-pdf/renderer";
import { withClassName } from "@dwidge/class-name-rnw";
import React, { ReactNode } from "react";
import { GestureResponderEvent, StyleProp, TextStyle } from "react-native";
import { DeleteDialogProps } from "../complex/DeleteDialog";

const Debug = ({
  children = <></>,
  themeKey = "",
  className = "",
  stylesheet = {} as Record<string, any>,
  debug = !!stylesheet.debug,
}) =>
  debug ? (
    <PDF.View style={{ flexDirection: "column" }}>
      <PDF.Text
        style={{ fontSize: 8, color: "white", backgroundColor: "black" }}
      >
        {themeKey} {className}
      </PDF.Text>
      {children}
    </PDF.View>
  ) : (
    children
  );

const wrap = withClassName(Debug);

export const Text = wrap(
  ({
    children,
    ...props
  }: {
    variant?: string;
    id?: string;
    children?: React.ReactNode;
  }) => <PDF.Text {...props}>{children}</PDF.Text>,
  "StyledFormText",
);
export const View = wrap(
  ({ children, ...props }: { id?: string; children?: React.ReactNode }) =>
    children ? <PDF.View {...props}>{children}</PDF.View> : null,
  "StyledFormView",
);

export const DataTable = Object.assign(View, {
  Header: View,
  Title: wrap(
    ({
      children,
      ...props
    }: {
      numeric?: boolean;
      children?: React.ReactNode;
    }) => <Text {...props}>{children}</Text>,
    "StyledFormText",
  ),
  Cell: View,
  Row: View,
});

export const Card = Object.assign(View, {
  Content: View,
});

export const List = Object.assign(
  {},
  {
    Item: wrap(
      ({
        title = "",
        left: Left,
        right: Right,
        ...props
      }: {
        title?: string;
        description?: string;
        left?: (props: { color?: string }) => React.ReactNode;
        right?: (props: { color?: string }) => React.ReactNode;
        onPress?: (e: GestureResponderEvent) => void;
        descriptionStyle?: StyleProp<TextStyle>;
        titleNumberOfLines?: number;
        descriptionNumberOfLines?: number;
        testID?: string;
      }) => (
        <View {...props}>
          <PDF.Text>{title}</PDF.Text>
          {Left && <Left />}
          {Right && <Right />}
        </View>
      ),
      "StyledFormView",
    ),
    Accordion: wrap(
      ({
        title,
        children,
        ...props
      }: {
        onPress?: () => unknown;
        accessibilityLabel?: string;
        title?: string;
        children?: React.ReactNode;
      }) => (
        <View {...props}>
          {title && <PDF.Text>{title}</PDF.Text>}
          {children}
        </View>
      ),
      "StyledFormView",
    ),
  },
);

export const Avatar = Object.assign(
  {},
  {
    Text: wrap(
      ({ label = "", ...props }: { label?: string }) => (
        <Text {...props}>{label}</Text>
      ),
      "StyledFormText",
    ),
  },
);

export const Menu = Object.assign(
  ({
    children,
    className,
    ...props
  }: {
    anchor?: ReactNode;
    onDismiss?: () => unknown;
    visible?: boolean;
    children?: React.ReactNode;
    className?: string;
  }) => (
    <View {...props} className={className + " menu"}>
      {children}
    </View>
  ),
  {
    Item: ({
      title = "",
      className,
      ...props
    }: {
      title?: string;
      onPress?: () => unknown;
      className?: string;
    }) => (
      <Text {...props} className={className + " menu-item"}>
        {title}
      </Text>
    ),
  },
);

export const Title = Text;
export const Button = wrap(
  ({
    children,
  }: {
    onPress?: () => unknown;
    accessibilityLabel?: string;
    mode?: string;
    disabled?: boolean;
    children?: React.ReactNode;
  }) => children,
  "StyledFormButton",
);
export const IconButton = wrap(
  ({}: {
    icon: string;
    onPress?: () => unknown;
    accessibilityLabel?: string;
    disabled?: boolean;
  }) => <></>,
  "StyledFormButton",
);
export const TextInput = ({
  value = "",
  className,
  ...props
}: {
  mode?: "outlined";
  label?: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (v: string) => unknown;
  onFocus?: () => unknown;
  id?: string;
  editable?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  maxLength?: number;
  testID?: string;
  disabled?: boolean;
  multiline?: boolean;
  keyboardType?: "numeric";
  error?: boolean;
  className?: string;
}) => (
  <Text {...props} className={className + " text-input"}>
    {value}
  </Text>
);
export const Tooltip = ({
  children,
  className,
  ...props
}: {
  title?: string;
  id?: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  <View {...props} className={className + " tooltip"}>
    {children}
  </View>
);
export const Paragraph = Text;
export const Surface = View;

export const Slider = ({
  value,
  className,
  ...props
}: {
  value?: number;
  onValueChange?: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  onSlidingComplete?: (value: any) => void;
  className?: string;
}) => (
  <Text {...props} className={className + " slider"}>
    {value}
  </Text>
);

export const ScrollView = wrap(
  ({
    children,
    className,
    ...props
  }: {
    horizontal?: boolean;
    contentContainerStyle?: object;
    testID?: string;
    children?: React.ReactNode;
    className?: string;
  }) => (
    <View {...props} className={className + " layout"}>
      {children}
    </View>
  ),
  "StyledFormView",
);

export const DeleteDialog = ({}: DeleteDialogProps) => <></>;

export const Checkbox = ({
  status,
  className,
  ...props
}: {
  id?: string;
  status?: "checked" | "unchecked";
  onPress?: () => unknown;
  disabled?: boolean;
  className?: string;
}) => (
  <Text {...props} className={className + " checkbox"}>
    {status === "checked" ? "Yes" : "No"}
  </Text>
);

export const Badge = ({
  children,
}: {
  size?: number;
  children?: React.ReactNode;
  className?: string;
}) => children;
export const Icon = ({}: {
  source?: string;
  size?: number;
  className?: string;
}) => <></>;
