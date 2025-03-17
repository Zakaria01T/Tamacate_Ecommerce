import { useState } from 'react'
import { useSelector } from 'react-redux'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { API } from '../api/api'

export default function CheckoutPage() {
    const stripe = useStripe()
    const elements = useElements()
    const { total } = useSelector((state) => state.cart)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Créer l'intention de paiement
            const { data: { clientSecret } } = await API.post('/api/payment/create-payment-intent', {
                amount: total * 100
            })

            // Confirmer le paiement
            const { error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            })

            if (error) throw error
            alert('Paiement réussi!')

        } catch (error) {
            console.error('Erreur de paiement:', error)
            alert('Échec du paiement')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-3xl font-bold mb-6">Paiement</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <CardElement className="p-4 border rounded-lg" />

                <div className="text-xl font-bold text-right">
                    Total: €{total.toFixed(2)}
                </div>

                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? 'Traitement...' : 'Payer maintenant'}
                </button>
            </form>
        </div>
    )
}