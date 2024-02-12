const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');

router.post('/graph-data', graphController.createGraph);
router.get('/get-latest-diagram', graphController.getGraph);

const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = new Sequelize('nexabuild', 'nexabuild', 'nexabuild', {
    host: 'localhost',
    dialect: 'postgres',
  });
router.get('/schemas', async (req, res) => {
    try {
      // Query que retorna todos os schemas não-padrão do banco de dados
      const schemas = await sequelize.query(
        "SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'pg_catalog')",
        { type: QueryTypes.SELECT }
      );
      
      // Enviamos a resposta em formato JSON
      res.json(schemas);
    } catch (error) {
      // Em caso de erro, enviamos uma resposta com status 500 e a mensagem de erro
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/schema/:schemaName', async (req, res) => {
    const { schemaName } = req.params;
  
    try {
      const tables = await sequelize.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = $1 AND table_type = 'BASE TABLE'",
        {
          bind: [schemaName],
          type: QueryTypes.SELECT,
        }
      );
  
      // Enviamos a resposta em formato JSON
      res.json(tables);
    } catch (error) {
      // Em caso de erro, enviamos uma resposta com status 500 e a mensagem de erro
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/schema/:schemaName/table/:tableName', async (req, res) => {
    const { schemaName, tableName } = req.params;
  
    try {
      const fields = await sequelize.query(`
        SELECT 
          column_name,
          data_type,
          character_maximum_length,
          column_default,
          is_nullable,
          numeric_precision,
          numeric_scale,
          datetime_precision,
          collation_name 
        FROM information_schema.columns 
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position
      `, {
        bind: [schemaName, tableName],
        type: QueryTypes.SELECT,
      });
  
      // Enviamos a resposta em formato JSON
      res.json(fields);
    } catch (error) {
      // Em caso de erro, enviamos uma resposta com status 500 e a mensagem de erro
      res.status(500).json({ error: error.message });
    }
  });
  router.get('/api/schema/:schemaName/table/:tableName/records/:start/:end', async (req, res) => {
    const { schemaName, tableName, start, end } = req.params;
    const offset = parseInt(start, 10);
    const limit = parseInt(end, 10) - offset + 1;
  
    try {
      if (limit < 1) {
        return res.status(400).json({ error: 'O valor final deve ser maior que o valor inicial.' });
      }
  
      const recordsQuery = `
        SELECT * FROM "${schemaName}"."${tableName}"
        ORDER BY id
        LIMIT $1 OFFSET $2
      `;
  
      const records = await sequelize.query(recordsQuery, {
        bind: [limit, offset],
        type: QueryTypes.SELECT,
      });
  
      // Enviamos a resposta em formato JSON
      res.json({
        start,
        end,
        data: records
      });
    } catch (error) {
      // Em caso de erro, enviamos uma resposta com status 500 e a mensagem de erro
      res.status(500).json({ error: error.message });
    }
  });
module.exports = router;
