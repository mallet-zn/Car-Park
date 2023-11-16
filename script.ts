interface Car {
	name: string
	plate: string
	entry: Date | string
}

(function () {
	const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

	function calcTime(mil: number) {
		const min = Math.floor(mil / 60000)
		const sec = Math.floor((mil % 60000) / 1000);

		return `${min}m:${sec}s`
	}

	function hall() {
		function read(): Car[] {
			return localStorage.hall ? JSON.parse(localStorage.hall) : []
		}

		function save(cars: Car[]) {
			localStorage.setItem('hall', JSON.stringify(cars))
		}


		function add(car: Car, saved?: boolean) {
			const row = document.createElement('tr')

			row.innerHTML = `
				<td>${car.name}</td>
				<td>${car.plate}</td>
				<td>${car.entry}</td>
				<td>
					<button class='delete' data-plate='${car.plate}'>Excluir</button>
				</td>
				`

			row.querySelector('.delete')?.addEventListener('click', function () {
				remove(this.dataset.plate)
			})

			$('#hall')?.appendChild(row)

			if (saved) save([...read(), car])
		}

		function remove(plate: string) {
			const { entry, name } = read().find((car) => car.plate === plate)

			const time = calcTime(new Date().getTime() - new Date(entry).getTime())

			if (!confirm(`The car ${name} remained ${time}. Do you want to terminate?`)) return

			save(read().filter(car => car.plate !== plate))
			render()
		}

		function render() {
			$('#hall')!.innerHTML = ''
			const hall = read()

			if (hall.length) {
				hall.forEach((car) => add(car));
			}
		}


		return { read, add, remove, save, render }
	}


	hall().render()
	$('#register')?.addEventListener('click', () => {
		const name = $('#name')?.value
		const plate = $('#plate')?.value

		if (!name || !plate) {
			alert('The fields name and plate are obrigatory')
			return
		}

		hall().add({ name, plate, entry: new Date().toISOString() }, true)
	})
})(); 