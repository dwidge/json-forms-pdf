import React from "react";
import { CellProps, isStringControl, RankedTester, rankWith } from "@jsonforms/core";
import { withJsonFormsCellProps } from "@jsonforms/react";
import type { VanillaRendererProps } from "../index";
import { withVanillaCellProps } from "../util/index";
import merge from "lodash/merge";
import { TextInput } from "../styles/components";

export const TextCell = (props: CellProps & VanillaRendererProps) => {
  const { config, data, id, className, enabled, uischema, schema, path, handleChange } = props;
  const maxLength = schema.maxLength;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  return (
    <TextInput
      className={className}
      mode="outlined"
      secureTextEntry={appliedUiSchemaOptions.format === "password"}
      value={data || ""}
      onChangeText={(value) => {
        handleChange(path, value === "" ? undefined : value);
      }}
      id={id}
      editable={enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      placeholder={appliedUiSchemaOptions.placeholder}
      maxLength={appliedUiSchemaOptions.restrict ? maxLength : undefined}
    />
  );
};

/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textCellTester: RankedTester = rankWith(1, isStringControl);

export default withJsonFormsCellProps(withVanillaCellProps(TextCell));
