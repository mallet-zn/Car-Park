(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTime(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m:${sec}s`;
    }
    function hall() {
        function read() {
            return localStorage.hall ? JSON.parse(localStorage.hall) : [];
        }
        function save(cars) {
            localStorage.setItem('hall', JSON.stringify(cars));
        }
        function add(car, saved) {
            var _a, _b;
            const row = document.createElement('tr');
            row.innerHTML = `
				<td>${car.name}</td>
				<td>${car.plate}</td>
				<td>${car.entry}</td>
				<td>
					<button class='delete' data-plate='${car.plate}'>Excluir</button>
				</td>
				`;
            (_a = row.querySelector('.delete')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                remove(this.dataset.plate);
            });
            (_b = $('#hall')) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (saved)
                save([...read(), car]);
        }
        function remove(plate) {
            const { entry, name } = read().find((car) => car.plate === plate);
            const time = calcTime(new Date().getTime() - new Date(entry).getTime());
            if (!confirm(`The car ${name} remained ${time}. Do you want to terminate?`))
                return;
            save(read().filter((car) => car.plate !== plate));
            render();
        }
        function render() {
            $('#hall').innerHTML = '';
            const hall = read();
            if (hall.length) {
                hall.forEach((car) => add(car));
            }
        }
        return { read, add, remove, save, render };
    }
    hall().render();
    (_a = $('#register')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b;
        const name = (_a = $('#name')) === null || _a === void 0 ? void 0 : _a.value;
        const plate = (_b = $('#plate')) === null || _b === void 0 ? void 0 : _b.value;
        if (!name || !plate) {
            alert('The fields name and plate are obrigatory');
            return;
        }
        hall().add({ name, plate, entry: new Date().toISOString() }, true);
    });
})();
