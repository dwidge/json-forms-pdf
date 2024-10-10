import React from "react";
import { CellProps, isMultiLineControl, RankedTester, rankWith } from "@jsonforms/core";
import { withJsonFormsCellProps } from "@jsonforms/react";
import type { VanillaRendererProps } from "../index";
import { withVanillaCellProps } from "../util/index";
import merge from "lodash/merge";
import { TextInput } from "../styles/components";

export const TextAreaCell = (props: CellProps & VanillaRendererProps) => {
  const { data, className, id, enabled, config, uischema, path, handleChange } = props;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  return (
    <TextInput
      mode="outlined"
      label="Text Area"
      value={data || ""}
      onChangeText={(value) => handleChange(path, value === "" ? undefined : value)}
      multiline
      className={className}
      testID={id}
      disabled={!enabled}
      onFocus={appliedUiSchemaOptions.focus}
      placeholder={appliedUiSchemaOptions.placeholder}
    />
  );
};

export const textAreaCellTester: RankedTester = rankWith(2, isMultiLineControl);

export default withJsonFormsCellProps(withVanillaCellProps(TextAreaCell));
