export const getRoleName = (roleId: string) => {
    switch (roleId) {
      case 'R0':
        return 'Admin';
      case 'R1':
        return 'Giáo viên';
      case 'R3':
        return 'Học sinh';
      default:
        return 'Chưa xác định';
    }
  };