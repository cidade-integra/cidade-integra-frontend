import { useEffect, useState } from "react";
import {messaging, getToken, onMessage} from '../firebase/notifications_fcm'

const useNotification = (vapidKey) => {
    const [notification, setNotification] = useState(null)
    const [fcmtoken, setFcmToken] = useState(null)
    const [currentNotification, setCurrentNotification] = useState(null)
    const [error, setError] = useState(null)

    //Solicitar permissão e obter Token
    const requestNotificationPermission = async (vapidKey) => {
        try {
            const permission = await Notification.requestPermission()
            setNotification(permission)

            if(permission === 'granted') {
                const token = await getToken(messaging, {vapidKey})
                setFcmToken(token)
                return token
            }
            return null
        } catch (err) {
            setError(err)
            console.error('Error requesting notification permission.', err)
            return null
        }
    }

    //Configurar Listeners
    useEffect(() => {
        //Listeners em 1°Plano
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Message recivied:', payload)
            setCurrentNotification(payload.notification)

            //Notificação se o Usuário está na página
            if(payload.notification) {
                const {title, body} = payload.notification
                new Notification(title, {body})
            }
        })

        // Limpar listeners quando o componente desmontar
        return() => {
            unsubscribe()
        }
    }, [])

    return {
        notification,
        fcmtoken,
        currentNotification,
        error,
        requestNotificationPermission,  
    }
}
export default useNotification