import React from 'react';
import MesaCard from './MesaCard';

const MesasList = ({ mesas, title, deleteMesa, soyColaborador }) => {
  return (
    <>
      {mesas.length > 0 && (
        <div><h2>{title}</h2>
          <div className="mesas-container">
            {mesas.map((mesa) => (
              <MesaCard key={mesa.id_mesa} mesa={mesa} handleDelete={deleteMesa} soyColaborador={soyColaborador}/>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MesasList;
