import { React, useState, useEffect } from "react";
import AsyncSelect, { useAsync } from "react-select/async";

const SelectAsync = (props) => {
  const [data, setData] = useState(props.data);
  const [selected,setSelected] = useState(props.data.selected ?? [])
  const [selectedOptions, setSelectedOptions] = useState([]);
  const colourOptions = data?.options ?? [];

  const filterColors = (inputValue) => {
    return colourOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const handleChange = (options) => {
    setSelectedOptions(options);
    setSelected(options);
    console.log(options);
    props.onSelect(options ?? [])
  };

  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterColors(inputValue));
      }, 1000);
    });

  useEffect(() => {
    console.log(props);
    setSelected(props.data.selected ?? {});
  }, [setData]);

  return (
    <AsyncSelect
      getValue
      isClearable
      name="vendor_id"
      value={selected}
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      onChange={handleChange}
    />
  );
};

export default SelectAsync;
