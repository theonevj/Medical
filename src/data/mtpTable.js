import { CircleMinus } from 'lucide-react';


export const mtpcolumns = (handleRemove) => [
    {
        field: 'doctor',
        headerClassName: 'super-app-theme--header',
        headerName: 'Dr. Name',
        flex: 1,
        minWidth: 150,
        renderCell:(params) =>(
            <span>{params.value?.drName}</span>
        )
    },
    {
        field: 'user',
        headerClassName: 'super-app-theme--header',
        headerName: 'Work With',
        flex: 1,
        minWidth: 150, 
        renderCell: (params) =>(
           <div className='flex items-center gap-2'>
              {
                params.value.map((user,index)=> (
                    <span key={index}>{user.codeName} {index!==params.value.length-1 && ','} </span>
                ))
              }
           </div>
        )  
    },
    {
        field: 'product',
        headerClassName: 'super-app-theme--header',
        headerName: 'Products',
        flex: 1,
        minWidth: 150, 
        renderCell: (params) =>(
            <div className='flex items-center gap-1'>
                {
                params.value.map((product,index)=>(
                    <span key={index}>{product.productName} {index!==params.value.length-1 && ','}</span>
                ))
                }   
            </div>
        )
    },
    {
        field: 'modeOfWork',
        headerClassName: 'super-app-theme--header',
        headerName: 'Mode Of Work',
        flex: 1,
        minWidth: 150, 
    },
    {
        field: 'description',
        headerClassName: 'super-app-theme--header',
        headerName: 'Description',
        flex: 1,
        minWidth: 150,  
    },
    {
        field: 'action',
        headerClassName: 'super-app-theme--header',
        headerName: 'Action',
        flex: 1,
        minWidth: 150,  
        renderCell: (params) =>(
            <div className='w-full h-full flex justify-start items-center'>
                 <CircleMinus onClick={()=>handleRemove(params.row.id)} className='text-red-500 cursor-pointer'></CircleMinus>
            </div>
        )
    }

]



  

