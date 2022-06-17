const timeValidation = (date: Date, expiredIn: number = 24) => {
  const currentDate = new Date();

  const inBetween = Math.floor(
    (currentDate.getTime() - date.getTime()) / (3600 * 1000)
  );

  return inBetween >= expiredIn ? false : true;
};

export default timeValidation;
