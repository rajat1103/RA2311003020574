const depots = [
    { ID: 1, MechanicHours: 60 },
    { ID: 2, MechanicHours: 135 },
    { ID: 3, MechanicHours: 188 },
    { ID: 4, MechanicHours: 97 },
    { ID: 5, MechanicHours: 164 }
];

const vehicles = [
    { TaskID: "b7fce9f7-6ca4-414f-8838-761cf2803adc", Duration: 2, Impact: 6 },
    { TaskID: "ec11e8b0-28b3-4897-98e8-b4960dccf2db", Duration: 5, Impact: 4 },
    { TaskID: "363ddbc0-0d06-48ba-9ad3-dc5b201fdeef", Duration: 3, Impact: 8 },
    { TaskID: "c7844949-c9ba-4b8c-99fb-5bebcc4f2ca0", Duration: 6, Impact: 2 },
    { TaskID: "4abe6f55-472a-44fa-a09c-53fd4a0009b1", Duration: 6, Impact: 1 },
    { TaskID: "97faefe9-7b0f-435d-b3c4-2b999541391d", Duration: 8, Impact: 5 },
    { TaskID: "acf1f609-a28d-4763-b1b6-9b50fbe69d86", Duration: 3, Impact: 9 },
    { TaskID: "ee606143-a024-475b-a44c-e7b4c686bd66", Duration: 4, Impact: 1 },
    { TaskID: "da50b7ed-87c3-40c1-bdb0-1ccd17188e19", Duration: 8, Impact: 10 },
    { TaskID: "73d0f27b-ace1-49f1-b09e-1f22ab155772", Duration: 6, Impact: 6 },
    { TaskID: "4ba8cb4c-7a09-4902-bb46-a69e5550be41", Duration: 4, Impact: 3 },
    { TaskID: "3fb5dbcb-154c-4e64-9afc-274191514e16", Duration: 3, Impact: 6 },
    { TaskID: "afde8b23-e1fb-4e6a-9edd-1c85e4f6aeb5", Duration: 2, Impact: 3 },
    { TaskID: "079002c0-715d-4fd1-97b0-cc6e51c5e551", Duration: 6, Impact: 2 },
    { TaskID: "81419879-6288-484c-b413-e7d6030e950f", Duration: 4, Impact: 3 },
    { TaskID: "22023213-8544-4c91-882f-5d47ec61c591", Duration: 7, Impact: 3 },
    { TaskID: "bce22745-5c33-4400-9af1-e3400d331b51", Duration: 7, Impact: 9 },
    { TaskID: "aef8b5c1-05a7-4396-8565-42730cf234cd", Duration: 2, Impact: 10 },
    { TaskID: "82103e52-1d90-4794-b8df-5a253140444e", Duration: 1, Impact: 4 },
    { TaskID: "78f2d4c1-2fb7-4f11-a0b9-f8a9fc376e37", Duration: 8, Impact: 10 },
    { TaskID: "899c44c2-a90b-40e6-9a23-2258887cd48f", Duration: 3, Impact: 1 },
    { TaskID: "fa5eabd2-7714-4984-bdca-9c2be522a976", Duration: 6, Impact: 4 },
    { TaskID: "11f3e8e6-b27c-49a7-9ad1-757a05b535f8", Duration: 5, Impact: 9 },
    { TaskID: "f792624c-ced8-4e2b-ac9e-c3f1a08e09df", Duration: 8, Impact: 5 },
    { TaskID: "8e762d24-64cf-45e6-aa83-8ba1aaffc936", Duration: 2, Impact: 10 },
    { TaskID: "0a524aab-d552-4334-b36c-e87925fd5a5f", Duration: 4, Impact: 4 },
    { TaskID: "59323fd4-43d2-4d62-ab87-8a603333503d", Duration: 7, Impact: 4 },
    { TaskID: "697a1b04-f340-4f48-a3e6-3a6b0ad11434", Duration: 7, Impact: 3 },
    { TaskID: "8fa38187-a7f0-4231-986c-87b92bda0c12", Duration: 4, Impact: 7 },
    { TaskID: "bc248d49-9a21-450f-91b2-a8d5ed43e83a", Duration: 4, Impact: 7 },
    { TaskID: "bfc1a184-6042-4b50-b9d4-17c1b092b369", Duration: 5, Impact: 3 },
    { TaskID: "f4d83de7-51e7-495d-aa00-3abf488f7be2", Duration: 2, Impact: 3 },
    { TaskID: "42db6743-f9a3-46e3-a482-08257757563d", Duration: 2, Impact: 3 },
    { TaskID: "27adf531-e559-41c9-95de-cf1833d0e7da", Duration: 6, Impact: 6 },
    { TaskID: "776e54bd-d60e-4e3b-bab3-f77be439a0e2", Duration: 4, Impact: 1 },
    { TaskID: "6bbfbeb4-caba-4ab5-850e-541d85498e5d", Duration: 4, Impact: 5 }
];

function knapsack(vehicles, capacity) {
    const n = vehicles.length;
    const dp = Array.from({ length: n + 1 }, () =>
        Array(capacity + 1).fill(0)
    );

    for (let i = 1; i <= n; i++) {
        const { Duration, Impact } = vehicles[i - 1];

        for (let w = 0; w <= capacity; w++) {
            if (Duration <= w) {
                dp[i][w] = Math.max(
                    Impact + dp[i - 1][w - Duration],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    let w = capacity;
    const selected = [];

    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selected.push(vehicles[i - 1].TaskID);
            w -= vehicles[i - 1].Duration;
        }
    }

    return {
        totalImpact: dp[n][capacity],
        selectedVehicles: selected.reverse()
    };
}

const finalOutput = depots.map(depot => {
    const result = knapsack(vehicles, depot.MechanicHours);

    return {
        depotId: depot.ID,
        totalImpact: result.totalImpact,
        selectedVehicles: result.selectedVehicles
    };
});

console.log(JSON.stringify(finalOutput, null, 2));