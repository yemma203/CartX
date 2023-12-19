import React from 'react'
import { useState } from 'react'

export default function Connexion() {
    // Fonction qui permet de se connecter
    const [username, setUsername] = useState('');
    const [mot_de_passe, setMot_de_passe] = useState('');
    const [Usertype, setUserType] = useState([]);
    const handleLogin = async (e) => {
        e.preventDefault();

        const user = {
            username: username,
            mot_de_passe: mot_de_passe,
        };
        try{
            const response = await fetch('http://localhost:8000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if(response.ok){
                try{

                }catch(err){
                    console.log(err.message);
                }
                const userTypeResponse = await fetch(`http://localhost:8000/users/type/${username}`);
                const userTypeData = await userTypeResponse.json();    
                console.log('Utilisateur connecté avec succès');
                setUsername('');
                setMot_de_passe('');
                // On ajoute l'utilisateur dans le localStorage pour le connecter
                setUserType(userTypeData.userType);
                localStorage.setItem('username', username);
                localStorage.setItem('userType', userTypeData.userType);
                window.location.href = '/home';
            }
            else{
                console.log('Erreur lors de la connexion');
            }
        }
        catch(err){
            console.error(err.message);
        }
    };
    return (
        <div className='connexionContainer'>
            <h1>Connexion</h1>
            <form onSubmit={handleLogin}>
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label htmlFor="mot_de_passe">Mot de passe</label>
                <input
                    type="password"
                    id="mot_de_passe"
                    value={mot_de_passe}
                    onChange={(e) => setMot_de_passe(e.target.value)}
                />

                <button type="submit">Se connecter</button>
            </form>
        </div>
    )
}
