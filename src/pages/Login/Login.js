import React, { useContext, useState } from 'react';
import { StyledButton } from '../../components/Button/Button.elements';
import { CardItem, CardInput, CardItemContainer } from '../../components/Card/Card.elements';
import { Card } from '../../components/index';
import {EnterIcon} from '@radix-ui/react-icons'
import { Link } from '../../components/Link/Link';
import Abstract from '../../db/Abstract';
import { AuthContext } from '../../firebase/Auth';
import { Navigate } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';

export const Login = () => {

    const [email, setEmail] = useState(false)
    const [password, setPassword] = useState(false)
    const [showSpinner, setShowSpinner] = useState(false)

    const handleSubmit = async() => {
        setShowSpinner(true)
        let ret = await Abstract.signIn(email, password)
        if (typeof(ret) === 'string') {
            alert(ret)
        }
    }

    const { currentUser } = useContext(AuthContext)
    if (currentUser) {
        return <Navigate to="/" replace />
    }

    const override = `
        display: block;
        margin: 0 auto;
        border-color: #6F8C43;
    `

    return (
        <>
        {!!showSpinner ? (
            <ScaleLoader color="red" loading={true} css={override} size={300} />
        ) : (
            <Card cardTitle="Login" >
                <CardItemContainer visibility={true}>
                    <CardItem>
                        <CardInput type="mail" placeholder="Email" inputWidth="100%" onChange={(e) => setEmail(e.target.value)}></CardInput>
                    </CardItem>
                    <CardItem>
                        <CardInput type="password" placeholder="Senha" inputWidth="100%" onChange={(e) => setPassword(e.target.value)}></CardInput>
                    </CardItem>
                    <CardItem>
                        <Link to="/cadastro" forgotpwd>esqueci minha senha</Link>
                    </CardItem>
                    <CardItem>
                        <StyledButton onClick={handleSubmit} primary hasIcon>entrar<EnterIcon/></StyledButton>
                    </CardItem>
                </CardItemContainer>  
            </Card>
        )}
        </>
    )
}