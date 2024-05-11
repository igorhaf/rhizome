import { Router } from 'express';
import { createGraph, getGraph } from '../controllers/graphController';

const router = Router();

router.post('/graph-data', createGraph);
router.get('/get-latest-diagram', getGraph);

import { Sequelize, QueryTypes } from 'sequelize';
import sequelize from '../models/index';

router.get('/schemas', async (req, res) => {
  try {
    const schemas = await sequelize.query(
        "SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'pg_catalog')",
        { type: QueryTypes.SELECT }
    );
    res.json(schemas);
  } catch (error) {
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
          type: QueryTypes.SELECT
        }
    );
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/schema/:schemaName/table/:tableName', async (req, res) => {
  const { schemaName, tableName } = req.params;
  try {
    const fields = await sequelize.query(`
            SELECT column_name, data_type, character_maximum_length, column_default, is_nullable, numeric_precision, numeric_scale, datetime_precision, collation_name 
            FROM information_schema.columns
            WHERE table_schema = $1 AND table_name = $2
            ORDER BY ordinal_position
        `, {
      bind: [schemaName, tableName],
      type: QueryTypes.SELECT
    });
    res.json(fields);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
