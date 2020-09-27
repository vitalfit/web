
URL = 'https://vitalfit-app.herokuapp.com'
$(document).ready(() => {
	mui.busy(true)
	$.ajax({
		type: 'GET',
		url: URL + '/myinfo',
		xhrFields: { withCredentials: true },
		crossDomain: true,
		success: function (data) {
			homePage.alumno = data
			$.ajax({
				type: 'GET',
				url: URL + '/myinfo/plan_asignado',
				xhrFields: { withCredentials: true },
				crossDomain: true,
				success: function (data2) {
					console.log(data2)
					if (data2 != "") {
						homePage.planAsignado = data2
						homePage.diaSeleccionado = data2.dias[0]
						console.log(homePage.planAsignado)
						mui.busy(false)
					} else {
						homePage.planAsignado = "No tiene plan asignado."
						mui.busy(false)
					}
				}
			})

		},
		error: function(error){
			if (error.status == 401){
				console.log(error)
				document.location.href = "index.html"
			}
		}
	})


	const homePage = new Vue({
		el: "#home-page",
		data: {
			alumno: {
				username: String,
				nombre: String,
				nacimiento: Date,
				nro_contacto: Number,
				mail: String,
				planes: Array
			},
			planAsignado: "",
			diaSeleccionado: "",
			colors: [
				'indigo',
				'warning',
				'pink darken-2',
				'red lighten-1',
				'deep-purple accent-4',
			],
			slides: [
				'First',
				'Second',
				'Third',
				'Fourth',
				'Fifth',
			],
			model: 0

		},
		methods: {
			handleSelectEjercicio: function (ejercicio) {
				ejercicioPage.idDia = this.diaSeleccionado._id;
				ejercicioPage.ejercicio = ejercicio;
				ejercicioPage.sesion.nombre= ejercicio.nombre
				ejercicioPage.sesion.series = ejercicio.series
				ejercicioPage.sesion.repeticiones = ejercicio.repeticiones
				ejercicioPage.sesion.intensidad = ejercicio.intensidad
				ejercicioPage.sesion.tiempo = ejercicio.tiempo

				mui.viewport.showPage("ejercicio-page", "SLIDE_LEFT");

			},
			verPlanes: function () {
				$.ajax({
					type: 'GET',
					url: URL + '/myinfo/planes',
					xhrFields: { withCredentials: true },
					crossDomain: true,
					success: function (data) {
						planesPage.planes = data
					}
				})
				mui.viewport.showPage("planes-page", 'SLIDE_LEFT')
			},
			verPlanActual: function () {
				$.ajax({
					type: 'GET',
					url: URL + '/myinfo/plan_asignado',
					xhrFields: { withCredentials: true },
					crossDomain: true,
					success: function (data) {
						planPageAsignado.plan = data
					}
				})
				mui.viewport.showPage("plan-page-asignado", 'SLIDE_LEFT')
			},
			logout: function () {
				$.ajax({
					type: 'GET',
					url: URL + '/logout',
					xhrFields: { withCredentials: true },
					crossDomain: true,
					success: function (data) {
						document.location.href = "index.html"
					}
				})
			}

		},
		vuetify: new Vuetify()
	})

	const planesPage = new Vue({
		el: "#planes-page",
		data: {
			planes: []
		},
		methods: {
			handleSelectDia: function (dia) {
				diaPage.dia = dia;
				diaPage.plan = this.plan;
				mui.viewport.showPage("dia-page", "SLIDE_LEFT");
			}
		}
	})

	const menuPanel = new Vue({
		el: "#menu-panel",
		methods: {
			logout: function () {
				$.ajax({
					type: 'GET',
					url: URL + '/logout',
					xhrFields: { withCredentials: true },
					crossDomain: true,
					success: function (data) {
						document.location.href = "index.html"
					}
				})
			},
			irachangepassword: function () {
				mui.viewport.showPage("changepassword-page", "SLIDE_LEFT");
			},
			seleccionarDia: function () {
				mui.busy(true)
				mui.viewport.showPage("seleccionarDia-page", "SLIDE_LEFT")
				seleccionarDia.cargarDias()
			}
		}
	})

	const planPageAsignado = new Vue({
		el: "#plan-page-asignado",
		data: {
			plan: Object
		},
		methods: {
			handleSelectDia: function (dia) {
				diaPageAsignado.dia = dia;
				diaPageAsignado.plan = this.plan;
				mui.viewport.showPage("dia-page-asignado", "SLIDE_LEFT");
			}
		}

	})

	const diaPage = new Vue({
		el: "#dia-page",
		data: {
			dia: Object,
			plan: Object
		},
		methods: {
			borrar: function (ejercicio1, sesion1) {
				urlSesiones = `https://app-personal-trainer.herokuapp.com/myinfo/planes/${this.plan._id}/dias/${this.dia._id}/ejercicios/${ejercicio1._id}/sesiones/${sesion1._id}`
				console.log(urlSesiones);
				POSTData = "Te amo"
				$.ajax({
					type: 'POST',
					dataType: "json",
					data: POSTData,
					url: urlSesiones,
					xhrFields: { withCredentials: true },
					crossDomain: true,
					success: function (data) {
						mui.viewport.showPage("dia-page-asignado", "SLIDE_LEFT");
					}
				})

			},
			verSesiones: function (value) {
				verSesiones.sesiones = value.sesiones
				verSesiones.nombreEjercicio = value.nombre
				mui.viewport.showPage("visualizarSesiones-page", "SLIDE_LEFT")
			},
			graph: function (ejercicio) {
				valores = []
				numeros = []
				i = 0
				for (const sesion in ejercicio.sesiones) {
					if (sesion.intensidad)
						i++;
					valores.push(sesion.intensidad);
					numeros.push(i);
				}
				zingchart.render({
					id: 'myChart',
					data: {
						type: 'line',
						series: [
							{ values: valores },
							{ values: numeros }
						]
					}
				});
			}
		}

	})

	const verSesiones = new Vue({
		el: '#visualizarSesiones-page',
		data: {
			nombreEjercicio: "",
			sesiones: []
		},
		methods: {}
	})

	const diaPageAsignado = new Vue({
		el: "#dia-page-asignado",
		data: {
			dia: Object,
			sesion: String,
			plan: Object
		},
		methods: {
			handleSelectEjercicio: function (ejercicio) {
				ejercicioPage.idDia = diaPageAsignado.dia._id;
				ejercicioPage.ejercicio = ejercicio;
				ejercicioPage.sesion.nombre= ejercicio.nombre,
				console.log(ejercicioPage.sesion)
				ejercicioPage.sesion.series = ejercicio.series,
				ejercicioPage.sesion.repeticiones = ejercicio.repeticiones,
				ejercicioPage.sesion.intensidad = ejercicio.intensidad,
				ejercicioPage.sesion.tiempo = ejercicio.tiempo

				mui.viewport.showPage("ejercicio-page", "SLIDE_LEFT");
			},
			seleccionarSesion: function (sesionSelected) {
				this.sesion = sesionSelected;
			},
			borrar: function (ejercicio1, sesion1) {
				urlSesiones = `https://app-personal-trainer.herokuapp.com/myinfo/planes/${this.plan._id}/dias/${this.dia._id}/ejercicios/${ejercicio1._id}/sesiones/${sesion1._id}`
				console.log(urlSesiones);
				POSTData = "Te amo"
				$.ajax({
					type: 'POST',
					dataType: "json",
					data: POSTData,
					url: urlSesiones,
					xhrFields: { withCredentials: true },
					crossDomain: true,
					success: function (data) {
						mui.viewport.showPage("dia-page-asignado", "SLIDE_LEFT");
					}
				})

			}
		},
	})

	const ejercicioPage = new Vue({
		el: "#ejercicio-page",
		data: {
			plan: Object,
			ejercicio: Object,
			idDia: String,
			sesion: {
				nombre: "",
				series: "",
				repeticiones: "",
				intensidad: "",
				tiempo: ""
			}
		},
		methods: {
			confirmarSesionEjercicios: function () {
				if (this.sesion.nombre != "" && this.sesion.series != "" && this.sesion.repeticiones != "" && this.sesion.intensidad != "") {
					idEjercicio = this.ejercicio._id;
					POSTData = this.sesion;
					urlSesiones = URL + '/myinfo/plan_asignado/dias/' + this.idDia + '/ejercicios/' + idEjercicio + '/sesiones'
					$.ajax({
						type: 'POST',
						dataType: "json",
						data: POSTData,
						url: urlSesiones,
						xhrFields: { withCredentials: true },
						crossDomain: true,
						success: function (data) {
							mui.viewport.showPage("home-page", "SLIDE_RIGHT");
						},
						error: function (error){
							mui.alert('error', error)
						}
					})
				}

			}
		}

	})

	const changepasswordPage = new Vue({
		el: "#changepassword-page",
		data: {
			password: Object
		},
		methods: {
			changepassword: function () {
				POSTData = ejercicioPage.password;
				$.ajax({
					type: 'POST',
					dataType: "json",
					data: {
						'newPassword': this.password.password
					},
					url: "https://app-personal-trainer.herokuapp.com/myinfo/changepassword",
					xhrFields: { withCredentials: true },
					crossDomain: true,
					success: function (data) {
						alert("Contraseña cambiada");
					}
				})
			}
		}
	})

	const seleccionarDia = new Vue({
		el: "#seleccionarDia-page",
		data: {
			dias: Array
		},
		methods: {
			cargarDias() {
				$.ajax({
					type: "GET",
					url: URL + "/myinfo/plan_asignado",
					xhrFields: { withCredentials: true },
					crossDomain: true,
					success: (data)=>{
						seleccionarDia.dias = data.dias
						mui.busy(false)
					}
				})
			},
			asignarDia(dia){
				homePage.diaSeleccionado = dia
				mui.viewport.showPage("home-page", "SLIDE_RIGHT");
			}
		},
		vuetify: new Vuetify()
	})
})