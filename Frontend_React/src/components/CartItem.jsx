import QuantityControl from './QuantityControl';

export default function CartItem({ item, onRemove }) {


  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b">
      {/* Image et informations */}
      <div className="flex items-center space-x-4 flex-1">
        <img
          src={`http://localhost:8000/images/products/${item.image}`}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />

        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-gray-600">{item.description}</p>
        </div>
      </div>

      {/* Contrôle de quantité */}
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        <QuantityControl
          item={item} />

        {/* Prix et actions */}
        <div className="text-right w-32">
          <p className="font-semibold">MAD{(item.price * item.quantity).toFixed(2)}</p>
          <button
            onClick={onRemove}
            className="text-sm bg-red-600 hover:bg-red-700 px-2 py-1 text-white rounded-lg mt-2"
            aria-label="Remove item"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
