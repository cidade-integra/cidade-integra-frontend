import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getMessaging, send } from "firebase/messaging";

const db = getFirestore()
const messaging = getMessaging()

export const sendStatusUpdateNotification = async (complaintId, newStatus) => {
    try {
        //Busca os dados da Denuncia
        const complaintRef = doc(db, 'complaints', complaintId)
        const complaintSnap = await getDoc(complaintRef)

        if(!complaintSnap.exists()) {
            throw new Error ('Denuncia não encontrada')
        }

        const complaint = complaintSnap.data()
        const userId = complaint.userId 

        //Buscar token FCM do Usuário
        const userRef = doc(db, 'users', userId)
        const userSnap = await getDoc(userRef)

        if(!userSnap.exists()) {
            throw new Error('Usuário não encontrado')
        }

        const user = userSnap.data()
        const fcmToken = user.fcmToken //Supondo que você armazena o token no usuário

        if(!fcmToken) {
            console.log('Usuário não tem um Token FCM registrado')
            return
        }

        //Enviar a Notificação
        const message = {
            token: fcmToken,
            noticication: {
                title: 'O Status da sua denúncia foi atualizado',
                bodt: `O Status da sua denúncia agora é: ${newStatus}`
            },
            data: {
                complaintId, 
                newStatus, 
                type: 'status_update'
            }
        }

        await send(messaging, message)
        console.log('Notificação enviada com sucesso!')
    } catch (error) {
        console.error('Erro ao Enviar Notificação', error)
        throw error
    }
}