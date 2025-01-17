<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let nodeId;

    let repeatEnabled = false;
    let repeatInterval = 1;
    let selectedDays = {
        mon: false, tue: false, wed: false,
        thu: false, fri: false, sat: false, sun: false
    };
    let startDate = new Date().toISOString().split('T')[0];
    let startTime = "00:00";
    
    $: nextOccurrence = calculateNextOccurrence(
        startDate, 
        startTime, 
        repeatEnabled, 
        repeatInterval, 
        selectedDays
    );

    function calculateNextOccurrence(date, time, repeat, interval, days) {
        // Logic to calculate next occurrence based on settings
        return new Date();
    }

    function handleSave() {
        dispatch('save', {
            nodeId,
            config: {
                repeatEnabled,
                repeatInterval,
                selectedDays,
                startDate,
                startTime,
            }
        });
    }
</script>

<div class="schedule-form">
    <h2>Schedule Configuration</h2>
    
    <div class="form-group">
        <label>
            <input type="checkbox" bind:checked={repeatEnabled}>
            Enable Repetition
        </label>
    </div>

    {#if repeatEnabled}
        <div class="form-group">
            <label>
                Repeat every
                <input type="number" 
                       bind:value={repeatInterval}
                       min="1" 
                       max="52"> weeks
            </label>
        </div>

        <div class="weekdays">
            {#each Object.entries(selectedDays) as [day, selected]}
                <button 
                    class="day-button" 
                    class:selected
                    on:click={() => selectedDays[day] = !selected}>
                    {day}
                </button>
            {/each}
        </div>
    {/if}

    <div class="form-group">
        <label>
            Start Date
            <input type="date" bind:value={startDate}>
        </label>
    </div>

    <div class="form-group">
        <label>
            Start Time
            <input type="time" bind:value={startTime}>
        </label>
    </div>

    <div class="preview">
        <h3>Next Occurrence</h3>
        <p>{nextOccurrence.toLocaleString()}</p>
    </div>

    <button class="save-button" on:click={handleSave}>
        Save Configuration
    </button>
</div>

<style>
    .schedule-form {
        padding: 1rem;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
        margin: 1rem 0;
    }

    .weekdays {
        display: flex;
        gap: 0.5rem;
        margin: 1rem 0;
    }

    .day-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #ccc;
        background: none;
        cursor: pointer;
    }

    .day-button.selected {
        background: #4a90e2;
        color: white;
        border-color: #4a90e2;
    }

    .save-button {
        width: 100%;
        padding: 0.75rem;
        background: #4a90e2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .preview {
        margin: 1rem 0;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 4px;
    }
</style>