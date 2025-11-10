import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

//Importing dnd libraries
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

//Importing icons
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { ChevronUp } from 'lucide-react';
import { ChevronDown } from 'lucide-react';


import { toast } from 'react-toastify'
import api from '../api';

const Place = ({ place, index, endPoint, removePlace, movePlace }) => {

  const [{ isDragging }, dragRef] = useDrag({
    type: 'location',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'location',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        movePlace(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => dragRef(dropRef(node))} className='p-3 hover:shadow cursor-move transition-all duration-300 px-4 flex justify-between border rounded-md bg-slate-50'>
      <div className='flex items-center gap-4'>
        <span className='text-gray-500'>#{index + 1}</span>
        <span className='font-medium text-lg'>{place}</span>
        {
          (index == 0 || index === endPoint)
          && <span className='text-sm'>{index === 0 ? "(Starting Point)" : "(Ending Point)"}</span>
        }
      </div>
      <span onClick={() => removePlace(index)} className='text-red-500 cursor-pointer'><DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon></span>
    </div>
  )
}


function AddStourPlan() {
  const { user } = useSelector((state) => state.auth);
  const [tourPlanName, setTourPlanName] = useState('')
  const [places, setPlaces] = useState([])
  const [tourType, setTourType] = useState(0)
  const [perKm, setPerKm] = useState(null)
  const [km, setKm] = useState(null)
  const [errors, setErrors] = useState({})
  const [allowance, setAllowance] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedAllowance, setSelectedAllowanace] = useState([])
  const [loading, setLoading] = useState(false)
  const [headQuater, setHeadQuater] = useState([])
  const [selectedHeadQuater, setSelectedHeadquater] = useState('')

  const movePlace = (fromIndex, toIndex) => {
    const updatedPlaces = [...places];
    const [movedPlace] = updatedPlaces.splice(fromIndex, 1);
    updatedPlaces.splice(toIndex, 0, movedPlace);
    setPlaces(updatedPlaces);
  };

  const removePlace = (ind) => {
    setPlaces((prevData) => prevData.filter((item, index) => ind !== index))
  }

  const [newPlace, setNewPlace] = useState('')

  const addNewPlace = () => {
    if (!newPlace) {
      toast.error("Please enter place value.")
      return
    }

    if (places.includes(newPlace)) {
      toast.warning("Place is already added.")
      return
    }
    setPlaces((prevData) => ([...prevData, newPlace]))
    setNewPlace('')
  }

  const validateData = () => {
    let newErrors = {}
    if (!tourPlanName) newErrors.tourplan = "Tourplan name is required."
    if (places.length === 0) newErrors.places = "Add one or more place."
    if (selectedAllowance.length === 0) newErrors.selectedAllowance = 'Please select any one allowance.'
    if (!perKm) newErrors.perKm = 'Please enter km value'
    if (!selectedHeadQuater) newErrors.headQuater = "Please select headquater."

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const addTourPlan = async () => {
    if (validateData()) {
      try {
        let locations = places.map((item, index) => ({ tourLocationID: 0, locationName: item, locationSequence: index }))

        const obj = {
          tourId: 0,
          tourName: tourPlanName,
          headQuarter: Number(selectedHeadQuater),
          tourType: tourType,
          perKm: perKm,
          lstAllowance: selectedAllowance,
          tourLocations: locations
        }

        console.log(obj)

        await api.post(`STPMTP`, obj)
        console.log("stp added")
        setTourPlanName('')
        setPlaces([])
        toast.success("Tour plan added successfully.")
      } catch (err) {
        console.log(err)
      }
    }

  }

  //get Allowance 
  const getAllowance = async () => {
    try {
      const response = await api.get('/User/getAllowace')
      console.log(response.data.data)
      setAllowance(response.data.data)
    } catch (err) {
      console.log(err)
      toast.error("Something went wrong.")
    }
  }

  const handleSelectAllowance = (item) => {
    const existItems = selectedAllowance.find((i) => item.allowanceID === i.allowanceID)
    if (existItems) {
      setSelectedAllowanace(() => selectedAllowance.filter((i) => i.allowanceID !== item.allowanceID))
    } else {
      setSelectedAllowanace((prevData) => [item, ...prevData])
    }
  }

  const fetchHeadquater = async () => {
    try {
      const response = await api.get('/Headquarters')
      setHeadQuater(response.data)
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message || "Something went wrong.")
    }
  }




  useEffect(() => {
    getAllowance()
    fetchHeadquater()
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='flex h-full flex-col gap-3 md:gap-4'>
        <div className='bg-white custom-shadow rounded-md md:py-4 py-3 px-3 md:px-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Link to={user.isAdmin ? '/admin/stpplan' : "/employee/stpplan"}><span className='text-gray-600 cursor-pointer'><ArrowBackIosIcon style={{ fontSize: '1.4rem' }}></ArrowBackIosIcon></span></Link>
            <h1 className='text-gray-800 text-base md:text-lg font-medium'>Add Standard Tour Plan</h1>
          </div>
        </div>
        <div className='bg-white h-full custom-shadow flex flex-col gap-4 rounded-md md:py-4 py-3 px-3 md:px-4'>
          <div className='flex flex-col mb-1 gap-2'>
            <label htmlFor='tourName' className='font-bold'>Tour Plan Name <span className='text-red-500'>*</span></label>
            <input onChange={(e) => setTourPlanName(e.target.value)} value={tourPlanName} type='text' name='tourPlanName' id='tourName' className='border outline-none w-1/4 py-1.5 px-2 rounded-md' placeholder='Enter Tour Name'></input>
            {errors.tourplan && <span className='text-sm text-red-500'>{errors.tourplan}</span>}
          </div>

          <div className='flex md:flex-row flex-col w-full items-start gap-4 md:gap-6'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='tourtype' className='font-bold'>Tour Type <span className='text-red-500'>*</span></label>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <input onChange={() => setTourType(2)} checked={tourType === 2} value={2} type='radio' id='ex-station'></input>
                  <label htmlFor='ex-station'>Ex - Station</label>
                </div>
                <div className='flex items-center gap-2'>
                  <input onChange={() => setTourType(0)} checked={tourType === 0} value={0} type='radio' id='local'></input>
                  <label htmlFor='local'>Local</label>
                </div>
                <div className='flex items-center gap-2'>
                  <input onChange={() => setTourType(1)} checked={tourType == 1} value={1} type='radio' id='outstation'></input>
                  <label htmlFor='outstation'>Outstation</label>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2 ml-5'>
              <label className='font-bold' htmlFor='perKm'>₹ Per Km <span className='text-red-500'>*</span></label>
              <input value={perKm} onChange={(e) => setPerKm(e.target.value)} id='perKm' type='number' className='border outline-none py-1.5 px-2 rounded-s' placeholder='Enter km'></input>
              {errors.perKm && <span className='text-sm text-red-500'>{errors.perKm}</span>}
            </div>

            <div className='flex w-52 flex-col gap-2 '>
              <label className='font-bold' htmlFor='allowance'>Allowance <span className='text-red-500'>*</span></label>
              <div className='relative w-full'>
                <div onClick={() => setOpen((prev) => !prev)} className='p-1.5 cursor-pointer border flex gap-2 justify-between items-center rounded-md '>
                  <span>Select Allowance</span>
                  <span >{open ? <ChevronUp className='w-5 h-5 text-gray-600'></ChevronUp> : <ChevronDown className='w-5 h-5 text-gray-600'></ChevronDown>}</span>
                </div>
                {
                  open &&
                  <div className='absolute h-24 overflow-scroll w-full shadow bg-white z-40'>
                    {
                      allowance.map((item, index) => (
                        <div key={index} className='grid p-2 grid-cols-4 items-start gap-2'>
                          <input className='col-span-1' onChange={() => handleSelectAllowance(item)} checked={selectedAllowance.includes(item)} type='checkbox'></input>
                          <span className='col-span-3 text-sm'>{item.allowanceName} (Rs. {item.allowanceAmount})</span>
                        </div>
                      ))
                    }
                  </div>
                }
                {errors.selectedAllowance && <span className='text-sm text-red-500'>{errors.selectedAllowance}</span>}
              </div>
            </div>
          </div>

          <div className='flex flex-row gap-10 mt-5'>
            <div className='flex flex-col gap-2 w-52 '>
              <label className='font-bold' htmlFor='km'>Km <span className='text-red-500'>*</span></label>
              <input value={km} onChange={(e) => setKm(e.target.value)} id='Km' type='number' className='border outline-none py-1.5 px-2 rounded-s' placeholder='Enter km'></input>
              {errors.km && <span className='text-sm text-red-500'>{errors.km}</span>}
            </div>
            <div className='flex w-52 flex-col gap-2'>
              <label>HeadQuaters <span className='text-sm text-red-500'>*</span></label>
              <select value={selectedHeadQuater} onChange={(e) => setSelectedHeadquater(e.target.value)} className='p-2 border '>
                <option value={''}>--- Select Headquarters ---</option>
                {
                  headQuater.map((hd) => (
                    <option value={hd.hqid}>{hd.hqName}</option>
                  ))
                }
              </select>
              {errors.headQuater && <span className='text-sm text-red-500'>{errors.headQuater}</span>}
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <span className='text-themeblue'><PlaceOutlinedIcon style={{ fontSize: '2.2rem' }}></PlaceOutlinedIcon></span>
            <h1 className='text-xl font-bold tracking-wide'>Places Visited Today</h1>
          </div>
          <div className='grid grid-cols-4 items-start w-3/5 gap-4'>
            <div className='flex col-span-3 flex-col gap-1'>
              <input onChange={(e) => setNewPlace(e.target.value)} value={newPlace} type='text' className='col-span-3 outline-none p-2.5 border rounded-md ' placeholder='Enter place name...'></input>
              {errors.places && <span className='text-sm text-red-500'>{errors.places}</span>}
            </div>
            <button onClick={addNewPlace} className='p-2.5 md:w-36 w-36 col-span-1 flex justify-center items-center gap-2 text-white bg-themeblue rounded-md font-medium'><span><AddOutlinedIcon></AddOutlinedIcon></span> Add Place</button>
          </div>

          <div className='overflow-scroll flex flex-col gap-2 h-80 w-full'>
            {
              places.length > 0 ? (
                places.map((place, index) => (
                  <Place key={index} place={place} removePlace={removePlace} endPoint={places.length - 1} index={index} movePlace={movePlace} />
                ))
              ) : (
                <div className='flex justify-center m-auto items-center'>
                  <div className='flex flex-col items-center gap-2'>
                    <span className='text-gray-400'><PlaceOutlinedIcon style={{ fontSize: '2.4rem' }}></PlaceOutlinedIcon></span>
                    <h1>No places added yet. Start by adding your first destination!</h1>
                  </div>
                </div>
              )
            }
          </div>
          {
            places.length > 0 &&
            <div onClick={addTourPlan} className='flex w-full  place-content-center'>
              <button className='p-2 transition-colors duration-300 hover:bg-blue-600 bg-blue-500 w-36 rounded-md text-white'>Submit</button>
            </div>
          }

        </div>
      </div>
    </DndProvider>
  )
}

export default AddStourPlan