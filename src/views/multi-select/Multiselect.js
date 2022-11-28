import { React, useState, useEffect } from "react";
import AsyncSelect, { useAsync } from "react-select/async";

const MultiSelect = (props) => {
  const [data, setData] = useState(props.data);
  const colourOptions = [{ label:"Red",value:'Red'},{label:"Blue",value:"Blue"}]

  const filterColors = (inputValue) => {
    return colourOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterColors(inputValue));
      }, 1000);
    });

  useEffect(() => {
    console.log(props);
  }, [setData]);

  return (
    <AsyncSelect
      isMulti
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
    />
  );
};

export default MultiSelect;
