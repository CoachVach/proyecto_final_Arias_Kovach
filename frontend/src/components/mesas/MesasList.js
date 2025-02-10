import React from 'react';
import MesaCard from './MesaCard';

const MesasList = ({ mesas, title }) => {
  return (
    <>
      {mesas.length > 0 && (
        <div><h2>{title}</h2>
          <div className="mesas-container">
            {mesas.map((mesa) => (
              <MesaCard key={mesa.id_mesa} mesa={mesa} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MesasList;
