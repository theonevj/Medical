export const getProductReport = [
    {
      field: 'prodId',
      headerName: 'Product ID',
      headerClassName: 'super-app-theme--header',
      flex: 0.6,
      minWidth: 100,
    },
    {
      field: 'ProductName',
      headerName: 'Product Name',
      headerClassName: 'super-app-theme--header',
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: 'isActive',
      headerName: 'Active',
      headerClassName: 'super-app-theme--header',
      flex: 0.6,
      minWidth: 100,
      // valueGetter: (params) => (params.row.isActive ? 'Yes' : 'No'),
      renderCell:(params) =>(
        <span>{params.row.isActive ? 'Yes' : 'No'}</span>
      )
    },
  ];
  