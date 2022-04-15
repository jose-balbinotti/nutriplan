import React, { useContext } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Abstract from '../../db/Abstract';
import { AuthContext } from '../../firebase/Auth';

export const EditUser = () => {
    const { currentUser } = useContext(AuthContext)
    const { uuid } = useParams();

    if (!!!currentUser) {
        return <Navigate to="/login" replace />
    }

    const handleEdit = async() => {
        let ret = await Abstract.editUser(uuid)
        alert(ret)
    }

    return (
        <>
            <h1>UUID do usuário { uuid }</h1>
            <button onClick={handleEdit}>editar</button>
        </>
    )
}
