import React, { useContext, useState } from 'react'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { AuthContext } from '../../firebase/Auth'
import { Navigate, useParams } from 'react-router-dom'
import { CardContainer, CardContent, CardContentRow } from '../../components/Card/Card.elements'
import { StyledButton } from '../../components/Button/Button.elements'
import { Card, InfoMenu, Loader } from '../../components'
import DatePicker from "react-datepicker"
import { addMonths, addDays, setHours, setMinutes, getDay } from 'date-fns'
import "react-datepicker/dist/react-datepicker.css"
import { registerLocale } from 'react-datepicker'
import pt from "date-fns/locale/pt-BR"
import AppointmentModel from '../../db/AppointmentModel'
import NutritionistModel from '../../db/NutritionistModel'
import { ModalMessage } from '../../components/ModalMessage/ModalMessage'

registerLocale("pt-BR", pt)

export const EditAppointment = () => {
    const { currentUser } = useContext(AuthContext)
    const { docId } = useParams();
    const [startDate, setStartDate] = useState(null)
    const [minDate, setMinDate] = useState(null)
    const [excludedTimes, setExcludedTimes] = useState(null)
    const [nutritionists, setNutritionists] = useState(null)
    const [nutritionist, setNutritionist] = useState(null)
    const [minDay, setMinDay] = useState(null)
    const [minMonth, setMonth] = useState(null)
    const [appoint, setAppoint] = useState(null)
    const [modalMessage, setModalMessage] = useState(false);
    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState()

    const nutritionistModel = new NutritionistModel()
    const appointmentModel = new AppointmentModel()
    
    const selectDateAndNutri = async () => {
        let appointment = await appointmentModel.getByDocId(docId)
        let dateArr = appointment.data.split("/")
        let timeArr = appointment.horario.split(":")
        let date = new Date(dateArr[2], dateArr[1]-1, dateArr[0], timeArr[0]*1, timeArr[1]*1)
        setNutritionist(appointment.nutricionista_uuid)
        setAppoint(appointment)
        setStartDate(date)
    }

    const scrollToItem = () => {
        setTimeout(() => {
            // let items = document.getElementsByClassName('react-datepicker__time-list-item--disabled')
            let items = document.getElementsByClassName('react-datepicker__time-list-item')
            for (let i = 0; i < items.length; i++) {
                if (items[i].innerHTML === '07:30') {
                    items[i].scrollIntoView()
                }
            }
        }, 250)
    }

    const selectMinDate = () => {
        let date = new Date()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        if (date.getDay() === 6) { //S??bado, seta data minima para segunda
            setMinDate(addDays(date, 2))
            setMinDay(addDays(date, 2).getDate())
            setMonth(addDays(date, 2).getMonth())
        } else if (date.getDay() === 0 || hours + 3 > 17) { //Domingo, seta data minima para segunda, ou hora + 3 > 17, seta proximo dia
            setMinDate(addDays(date, 1))
            setMinDay(addDays(date, 1).getDate())
            setMonth(addDays(date, 1).getMonth())
        } else {
            if (minutes > 30) {
                setMinDate(addDays(date, 1))
                setMinDay(addDays(date, 1).getDate())
                setMonth(addDays(date, 1).getMonth())
            } else {
                //exclui as pr??ximas 3 horas da listagem
                setExcludedTimes([
                    setHours(setMinutes(date, 0), hours),
                    setHours(setMinutes(date, 30), hours),
                    setHours(setMinutes(date, 0), hours + 1),
                    setHours(setMinutes(date, 30), hours + 1),
                    setHours(setMinutes(date, 0), hours + 2),
                    setHours(setMinutes(date, 30), hours + 2),
                    setHours(setMinutes(date, 0), hours + 3),
                    setHours(setMinutes(date, 30), hours + 3),
                ])
                setMinDate(date)
                setMinDay(date.getDate())
                setMonth(date.getMonth())
            }
        }
    }

    const handleCalendarOpen = () => {
        let date = new Date()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        if (date.getDay() === 6 || date.getDay() === 0 || hours + 3 > 17) {
            scrollToItem()
        } else {
            if (minutes > 30) {
                scrollToItem()
            }
        }
    }

    const getNutritionists = async () => {
        let nutritionistsList = await nutritionistModel.getAllNutritionists()
        setNutritionists(nutritionistsList)
    }

    const isWeekday = (date) => {
        const day = getDay(date)
        return day !== 0 && day !== 6
    }

    const handleChange = (date, event) => {
        if (date.getDate() <= minDay && date.getMonth() <= minMonth) {
            let stDate = new Date(date.getFullYear(), date.getMonth(), minDay, date.getHours(), date.getMinutes())
            setStartDate(stDate)
        } else if (date.getHours() === 0) {
            let stDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, date.getMinutes())
            setStartDate(stDate)
        } else {
            setStartDate(date)
        }
    }

    const handleClick = async (e) => {
        setLoader(true)
        e.preventDefault()
        let day = (startDate.getDate() < 10) ? "0"+startDate.getDate() : startDate.getDate()
        let month = ((startDate.getMonth()+1) < 10) ? "0"+(startDate.getMonth()+1) : (startDate.getMonth()+1) 
        let date = day + '/' + month + '/' + startDate.getFullYear()

        let hours = (startDate.getHours() < 10) ? "0"+startDate.getHours() : startDate.getHours()
        let minutes = (startDate.getMinutes() < 10) ? "0"+startDate.getMinutes() : startDate.getMinutes()
        let time = hours + ':' + minutes
        
        appoint.data = date
        appoint.horario = time
        await appointmentModel.update(docId, appoint)
        setMessage("Os dados foram alterados com sucesso");
        setModalMessage(true)
        setLoader(false)
    }

    const displayNutritionists = () => {
        var sel = document.getElementById('selectNutri')
        if (!!sel) {
            while (sel.hasChildNodes()) {
                sel.removeChild(sel.firstChild);
            }    
        }
        if (!!nutritionists) {
            let opt = document.createElement('option')
            opt.textContent += 'Selecione um nutricionista' // or opt.innerHTML += user.name
            sel.appendChild(opt)
            nutritionists.forEach(nutri => {
                let opt = document.createElement('option')
                opt.value = nutri.uuid
                opt.textContent += nutri.nome_completo // or opt.innerHTML += user.name
                console.log(nutri.uuid, nutritionist)
                if (nutri.uuid === nutritionist) {
                    opt.setAttribute("selected", "selected")
                }
                sel.appendChild(opt)
            })
            sel.setAttribute("disabled", "disabled")
        }
    }

    const pull_data = (data, propsSuccess) => {
        setModalMessage(data)
        if (!!propsSuccess) {
            window.location.reload()
        }
    }
    
    if (!!!currentUser) {
        return <Navigate to="/login" replace />
    } else if (!!!minDate) {
        selectDateAndNutri()
        selectMinDate()
        getNutritionists()
    }

    displayNutritionists()

    return (
        <>
        {!!loader && (
            <>
                <Loader/>
            </>
        )}
        {modalMessage && (
            <>
                <ModalMessage func={pull_data} success={true}>{message}</ModalMessage>
            </>
        )}
            <Card maxWidth={"100%"} cardTitle={"Editar consulta"}>
                <CardContainer justify={"space-between"} maxWidth={"100%"} display={"flex"}>
                    <InfoMenu menuState={"Editar consulta"}/>
                    <CardContent>
                        <form>
                            <CardContentRow>
                                
                                <select className="select-nutri" id="selectNutri"></select>
                                {/* {!!nutritionists && nutritionists.forEach(nutri => {
                                    return (
                                        <option value="Teste">Teste - {nutri.nome_completo}</option>
                                    )
                                })} */}
                            </CardContentRow>
                            <CardContentRow>
                                <DatePicker 
                                    // disabled
                                    selected={startDate}
                                    onChange={handleChange}
                                    locale={pt}
                                    minDate={minDate}
                                    maxDate={addMonths(new Date(), 3)}
                                    filterDate={isWeekday}
                                    // excludeDates={excludedDates}
                                    minTime={setHours(setMinutes(minDate, 0), 8)}
                                    maxTime={setHours(setMinutes(minDate, 30), 17)}
                                    excludeTimes={excludedTimes}
                                    placeholderText="Selecione uma data e um hor??rio"
                                    showTimeSelect
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    onCalendarOpen={handleCalendarOpen}
                                    withPortal
                                />
                            </CardContentRow>
                            <CardContentRow>
                                <StyledButton primary hasIcon marginTop={"20px"} onClick={handleClick}>marcar consulta<ArrowRightIcon/></StyledButton>
                            </CardContentRow>
                        </form>
                    </CardContent>
                </CardContainer>
            </Card>
        </>
    )
}