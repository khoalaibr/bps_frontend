// src/components/ResultView.jsx
import React from 'react';
import { Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const ResultView = ({ data }) => {
  if (!data.length) return null;

  return (
    <List>
      {data.map((item, index) => (
        <div key={index}>
          <ListItem>
            <ListItemText
              primary={`${item.documento} - ${item.nombreCompleto} - ${item.fechaEntrega}`}
            />
          </ListItem>
          {item.atenciones.map((atencion, idx) => (
            <ListItem key={idx} style={{ paddingLeft: '40px' }}>
              {atencion.subtopicname === 'No registro atencion' ? (
                <ListItemText primary="- No registro atencion" />
              ) : (
                <ListItemText
                  primary={`- ${atencion.modificadoPor} - ${atencion.subtopicname}`}
                />
              )}
            </ListItem>
          ))}
          <Divider />
        </div>
      ))}
    </List>
  );
};

export default ResultView;
