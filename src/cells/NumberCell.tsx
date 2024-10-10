import React from "react";
import { CellProps, isNumberControl, RankedTester, rankWith } from "@jsonforms/core";
import { withJsonFormsCellProps } from "@jsonforms/react";
import type { VanillaRendererProps } from "../index";
import { withVanillaCellProps } from "../util/index";
import { TextInput } from "../styles/components";

const toNumber = (value: string) => (value === "" ? undefined : Number(value));

export const NumberCell = (props: CellProps & VanillaRendererProps) => {
  const { data, className, id, enabled, uischema, path, handleChange } = props;

  return (
    <TextInput
      mode="outlined"
      label="Number"
      value={data !== undefined ? String(data) : ""}
      onChangeText={(value) => handleChange(path, toNumber(value))}
      className={className}
      testID={id}
      disabled={!enabled}
      onFocus={() => uischema.options && uischema.options.focus}
    />
  );
};

export const numberCellTester: RankedTester = rankWith(2, isNumberControl);

export default withJsonFormsCellProps(withVanillaCellProps(NumberCell));
