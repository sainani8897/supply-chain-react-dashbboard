import { React, useState, useEffect,forwardRef  } from "react";
import AsyncSelect, { useAsync } from "react-select/async";

const SelectAsync = forwardRef((props,ref) => {
  const [data, setData] = useState(props.data);
  const [selected, setSelected] = useState(props.data.selected ?? []);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const colourOptions = data?.options ?? [];
  const [options,setOptions] = useState(data?.options ?? []);

  const filterColors = (inputValue) => {
    return options.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const handleChange = (options) => {
    setSelectedOptions(options);
    setSelected(options);
    props.onSelect(options ?? []);
  };

  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterColors(inputValue));
      }, 1000);
    });

  useEffect(() => {
    setSelected(props.data.selected ?? {});
  }, [setData]);

  useEffect(() => {
    if (Array.isArray(props?.data?.options)) {
      setOptions(props?.data?.options);
    }
    if (props?.data?.clearValue) {
      setSelected(props.data.selected ?? {});
    }
  }, [props]);

  return (
    <AsyncSelect
      placeholder="Type to Search..."
      getValue
      isClearable
      name={props.data?.name ?? "vendor_id"}
      value={selected}
      cacheOptions
      defaultOptions  
      loadOptions={promiseOptions}
      onChange={handleChange}
      ref={ref}
    />
  );
});

export default SelectAsync;
