import { useState } from "react";

interface PollData {
  title: string;
  options: string[];
}

const useCreatePoll = () => {
  const [PollData, setPollData] = useState<PollData>({
    title: "",
    options: ["", ""],
  });
  const handleAddOption = () => {
    setPollData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setPollData((prev) => {
      const updatedOptions = [...prev.options];
      updatedOptions[index] = value;
      return { ...prev, options: updatedOptions };
    });
  };

  const handleOptionDelete = (index: number) => {
    setPollData((prev) => {
      const updatedOptions = prev.options.filter((_, i) => i !== index);
      return { ...prev, options: updatedOptions };
    });
  };
  return {
    PollData,
    setPollData,
    handleAddOption,
    handleOptionChange,
    handleOptionDelete,
  };
};

export default useCreatePoll;
