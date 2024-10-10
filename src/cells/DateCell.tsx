import React from "react";
import { CellProps, isDateControl, RankedTester, rankWith } from "@jsonforms/core";
import { withJsonFormsCellProps } from "@jsonforms/react";
import type { VanillaRendererProps } from "../index";
import { withVanillaCellProps } from "../util/index";
import { TextInput } from "../styles/components";

export const DateCell = (props: CellProps & VanillaRendererProps) => {
  const { data, className, id, enabled, uischema, path, handleChange } = props;

  return (
    <TextInput
      mode="outlined"
      label="Date"
      value={data || ""}
      onChangeText={(value) => handleChange(path, value)}
      className={className}
      testID={id}
      disabled={!enabled}
      onFocus={() => uischema.options && uischema.options.focus}
    />
  );
};

export const dateCellTester: RankedTester = rankWith(2, isDateControl);

export default withJsonFormsCellProps(withVanillaCellProps(DateCell));
