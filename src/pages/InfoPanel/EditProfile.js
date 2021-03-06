import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../firebase/Auth';
import { Card, InfoMenu, Loader } from '../../components';
import { CardContainer, CardInput, CardInputMask, CardItem, CardItemContainer } from '../../components/Card/Card.elements';
import { StyledButton } from '../../components/Button/Button.elements';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { ArrowRightIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import Animated from 'react-mount-animation';
import UserModel from '../../db/UserModel';
import { ModalMessage } from '../../components/ModalMessage/ModalMessage';

export const EditProfile = () => {
    const { currentUser } = useContext(AuthContext)
    const [user, setUser] = useState({
        uuid: currentUser.uuid,
        firstname: currentUser.nome,
        lastname: currentUser.sobrenome,
        email: currentUser.email,
        ddd: currentUser.ddd,
        phone: currentUser.telefone,
        cpf: currentUser.cpf,
        crn: currentUser.crn,
    })
    const [modalMessage, setModalMessage] = useState(false);
    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState()

    const handleChange = (e) => {
        const { name, value } = e.target

        setUser(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async(e) => {
        setLoader(true)
        e.preventDefault()
        await changeUserData()
        setMessage("Os dados foram alterados com sucesso");
        setModalMessage(true)
        setLoader(false)
    }

    const changeUserData = async() => {
        let userModel = new UserModel();
        await userModel.updateUser(user);
    }

    const pull_data = (data, propsSuccess) => {
        setModalMessage(data)
        if (!!propsSuccess) {
            window.location.reload()
        }
    }

    if (!!!currentUser) {
        return <Navigate to="/login" replace />
    }

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
            <Card cardTitle={"Editar perfil"} maxWidth={"100%"}>
                <CardContainer justify={"space-between"} maxWidth={"100%"} display={"flex"}>
                    <InfoMenu/>
                    <Card margin={"0 auto"} showTitle={"none"}>
                    <CardItemContainer visibility={true}>
                        <form onSubmit={handleSubmit}>
                        <CardItem>
                            <CardInput onChange={handleChange} defaultValue={currentUser.nome} autoComplete="off" pattern="[A-Za-z??-????-????-??]{2,20}" required placeholder="Nome" inputWidth="calc(50% - 46px)" name="firstname"></CardInput>
                            <CardInput onChange={handleChange} defaultValue={currentUser.sobrenome} autoComplete="off" pattern="[A-Za-z??-????-????-??]{2,20}" required placeholder="Sobrenome" inputWidth="calc(50% - 46px)" name="lastname"></CardInput>
                            <ErrorMessage><ExclamationTriangleIcon/>Nome e Sobrenome deve conter de 2 a 20 caracteres</ErrorMessage>
                        </CardItem>
                        <CardItem>
                            <CardInput onChange={handleChange} disabled defaultValue={currentUser.email} pattern="(?!test@test\.com$)[a-z0-9._%+-]{3,}@[a-z]{3,}\.[a-z]{2,}(?:\.[a-z]{2,})?" required type="email" placeholder="Email" inputWidth="100%" name="email" autoComplete="off"></CardInput>
                            <ErrorMessage><ExclamationTriangleIcon/>Formato inv??lido</ErrorMessage>
                        </CardItem>
                        <CardItem>
                            <CardInputMask onChange={handleChange} defaultValue={currentUser.ddd} mask='99' pattern={"[0-9]{2}"} required placeholder="DDD" inputWidth="calc(18% - 46px)" name="ddd" ></CardInputMask>
                            <CardInputMask onChange={handleChange} defaultValue={currentUser.telefone} mask='9999-9999' pattern={"[0-9]{4}-[0-9]{4}"} required placeholder="Telefone" inputWidth="calc(82% - 46px)" name="phone" ></CardInputMask>
                            <ErrorMessage><ExclamationTriangleIcon/>Formato inv??lido</ErrorMessage>
                        </CardItem>
                        <CardItem>
                            <CardInputMask onChange={handleChange} defaultValue={currentUser.cpf} disabled id="cpf" mask='999.999.999-99' required pattern={"[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}"} placeholder="CPF" name="cpf" autoComplete="off"></CardInputMask>
                            <ErrorMessage><ExclamationTriangleIcon/></ErrorMessage>
                        </CardItem>
                            {currentUser.isNutri && 
                            <Animated.div show={true} mountAnim={`0% {opacity: 0}100% {opacity: 1}`}>
                                <CardItem>
                                    <CardInput onChange={handleChange} defaultValue={currentUser.crn} disabled required={false} placeholder="CRN" inputWidth="100%" name="crn" autoComplete="off"></CardInput>
                                    <ErrorMessage><ExclamationTriangleIcon/>Formato inv??lido</ErrorMessage>
                                </CardItem>
                            </Animated.div>
                            }
                        <StyledButton primary hasIcon marginTop={"20px"}>Salvar<ArrowRightIcon/></StyledButton>
                        </form>
                    </CardItemContainer>
                    </Card>
                </CardContainer>
            </Card>
        </>
    )
}
