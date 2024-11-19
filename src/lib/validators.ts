export const validateTitle = (title: string): boolean => {
    return title.trim().length >= 3 && title.trim().length <= 200;
  };

export const validateOptions = (options: string[]): boolean => {
    const uniqueOptions = new Set(options.map(opt => opt.trim()));
    return (
      options.every(opt => opt.trim().length > 0) && 
      uniqueOptions.size === options.length
    );
  };