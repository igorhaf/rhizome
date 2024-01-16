<template>
    <div class="container mx-auto  max-w" style="padding-bottom: 300px">
        <div >
            <div class="overflow-y-auto max-h-[500px] shadow border-b border-gray-200 bg text">

            <vue-good-table
                :columns="columns"
                :rows="rows"
                :pagination-options="{enabled: true}"
                :globalSearch="true"
                theme="nocturnal"
                :sort-options="{ enabled: true, initialSortBy: { field: 'name', type: 'asc' }}"

            >
                <template v-slot:table-row="props">
                  <span v-if="props.column.field === 'age'" class="table-database">
                    {{ props.row.age }} years
                  </span>
                    <span v-else class="table-database">
                    {{ props.formattedRow[props.column.field] }}
                    </span>
                </template>
            </vue-good-table>
            </div>
        </div>
    </div>
</template>

<script>
import VueGoodTablePlugin from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';

export default {
    name: 'Database',
    components: {
        VueGoodTable: VueGoodTablePlugin.VueGoodTable
    },
    data() {
        return {
            // Define as colunas da tabela
            columns: [
                {
                    label: 'Name',
                    field: 'name',
                    sortable: true
                },
                {
                    label: 'Age',
                    field: 'age',
                    type: 'number',
                    sortable: true
                },
                {
                    label: 'Created On',
                    field: 'createdAt',
                    type: 'date',
                    dateInputFormat: 'yyyy-MM-dd',
                    dateOutputFormat: 'MMM do yyyy',
                    sortable: true
                },
            ],
            // Adiciona algumas linhas de exemplo
            rows: [
                { name: 'John Doe', age: 20, createdAt: '1990-09-29' },
                { name: 'Jane Smith', age: 25, createdAt: '1995-10-07' },
                { name: 'William Johnson', age: 30, createdAt: '1989-04-11' },
                // Adicione mais 47 registros seguindo o mesmo padrão
                ...Array.from({ length: 47 }, (_, index) => ({
                    name: `User ${index + 4}`, // Começando a contagem de 4 pois você já tem 3 usuários
                    age: 20 + index % 30, // Isso dará uma idade entre 20 e 49 anos
                    createdAt: `199${index % 10}-01-${String(index % 28 + 1).padStart(2, '0')}` // Data fictícia em janeiro
                }))
            ],
            // Estilos da tabela
        };
    }
};
</script>

<style>
.vgt-table.nocturnal.bordered td, .vgt-table.nocturnal.bordered th {
    border: 1px solid #435169;
}

.vgt-table.nocturnal {
    border: 1px solid #435169;
    background-color: #000;
}
.table-database {
    font-size: 10px;
}

table.vgt-table td {
    padding: 0 5px 0 5px;
    vertical-align: top;
    border-bottom: 1px solid #DCDFE6;
    color: #606266;
}
.vgt-right-align, .vgt-left-align{
    font-size: 12px;
    font-weight: normal;
}

th {
    /* padding: 0.75em 1.5em 0.75em 0.75em; */
    vertical-align: middle;
    position: relative;
}
</style>

