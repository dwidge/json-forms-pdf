import React from "react";
import { LabelProps, RankedTester, rankWith, uiTypeIs } from "@jsonforms/core";
import { withJsonFormsLabelProps } from "@jsonforms/react";
import { Text } from "../styles/components";

/**
 * Default tester for a label.
 * @type {RankedTester}
 */
export const materialLabelRendererTester: RankedTester = rankWith(1, uiTypeIs("Label"));

/**
 * Default renderer for a label.
 */
export const MaterialLabelRenderer = ({ text, visible, uischema }: LabelProps) => {
  if (!visible) {
    return null;
  }
  return <Text className={["label", uischema.options?.className].join(" ")}>{text}</Text>;
};

export default withJsonFormsLabelProps(MaterialLabelRenderer);
