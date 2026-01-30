export const getGenderName = (gender?: boolean): string => {
  if (gender === undefined || gender === null) return '---';
  return gender ? 'Nam' : 'Nữ';
};
