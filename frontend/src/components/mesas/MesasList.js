import React from 'react';
import MesaCard from './MesaCard';

const MesasList = ({ mesas, onDelete }) => {
  return (
    <div className="mesas-container">
      {mesas.map((mesa) => (
        <MesaCard key={mesa.id_mesa} mesa={mesa} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default MesasList;
