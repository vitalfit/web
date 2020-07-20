URL = 'https://vitalfit-app.herokuapp.com'
		
		$(document).ready(() => {

			//******** INTERACCIONES CON LA BASE DE DATOS **********//
			mui.busy(true)
			$.ajax({
				type: 'GET',
				url: URL + '/clientes/',
				xhrFields: { withCredentials: true },
				crossDomain: true,
				success: function (data) {
					homePage.alumnos = data
					mui.busy(false)
				}
			})
			/*
			new Vue({
				el: '#app',
				vuetify: new Vuetify(),
			})

			
			<div id="app">
				<v-app>
				<v-content>
					<v-container>Hello world</v-container>
				</v-content>
				</v-app>
			</div>
			*/

			//******** OBJETOS VUE **********//

			const homePage = new Vue({
				el: "#home-page",
				data: {
					alumnos: [],
					alumnoSeleccionado: "",
					search: ""
				},
				methods: {
					nuevoAlumno: function() {
						mui.viewport.showPage("nuevoAlumno-page", 'SLIDE_LEFT')
					},
					verAlumno: function () {
						console.log(this.alumnoSeleccionado)
						verAlumno.alumno.nombre = this.alumnoSeleccionado.nombre.split(" ")[0]
						verAlumno.alumno.apellido = this.alumnoSeleccionado.nombre.split(" ")[1]
						verAlumno.alumno.username = this.alumnoSeleccionado.username
						if(this.alumnoSeleccionado.fecha_nacimiento != undefined){
							verAlumno.alumno.fecha_nacimiento = this.alumnoSeleccionado.fecha_nacimiento.split("T")[0]
						}
						verAlumno.alumno.nro_contacto = this.alumnoSeleccionado.nro_contacto
						verAlumno.alumno.mail = this.alumnoSeleccionado.mail
						mui.viewport.showPage("visualizarAlumno-page", 'SLIDE_LEFT')
					},
					verPlanes: async function () {
						verPlanes.alumno = this.alumnoSeleccionado
						await verPlanes.cargarPlanes()
						mui.viewport.showPage("visualizarPlanes-page", 'SLIDE_LEFT')

					},
					abrirPlanNuevo: function (alumno) {
						planNuevo.alumno = alumno
						mui.viewport.showPage("planNuevo-page", 'SLIDE_LEFT')
					},
					abrirNuevaSesion: function () {
						nuevaSesion.alumno = this.alumnoSeleccionado
						nuevaSesion.cargarDatos()
						mui.viewport.showPage("nuevaSesion-page", 'SLIDE_LEFT')
					},
					asignacionPlan: function () {
						asignarPlan.alumno = this.alumnoSeleccionado
						asignarPlan.cargarPlanes()
						mui.viewport.showPage("asignarPlan-page", 'SLIDE_LEFT')
					},
					eliminarAlumno: function () {
						username = this.alumnoSeleccionado.username
						mui.busy(true)
						$.ajax({
							type: 'DELETE',
							url: URL + '/clientes/' + username,
							xhrFields: { withCredentials: true },
							crossDomain: true,
							success: function (data) {
								mui.busy(false)
								alert("Eliminado")
							}
						})
					},

					logout: function () {
						mui.busy(true)
						$.ajax({
							type: 'GET',
							url: URL + '/logout',
							xhrFields: { withCredentials: true },
							crossDomain: true,
							success: function (data) {
								mui.busy(false)
								document.location.href = "index.html"
							}
						})
					},
					seleccionarAlumno(alumno) {
						this.alumnoSeleccionado = alumno
						console.log('Alumno seleccionado' )
						console.log(this.alumnoSeleccionado)
					}
				},
				computed: {
					alumnosFiltrados() {
						return this.alumnos.filter(alumno => {
			             if(!this.search) return this.alumnos;
			               return (alumno.nombre.toLowerCase().includes(this.search.toLowerCase()));
						});
        			}
				},
				vuetify: new Vuetify()
			})

			const nuevaSesion = new Vue({
				el: "#nuevaSesion-page",
				data: {
					planes: [],
					plan_actual: '',
					alumno: ""
				},
				methods: {
					async cargarDatos() {
						URL2 = URL + '' + '/clientes/' + this.alumno.username + '/planes'
						mui.busy(true)
						await $.ajax({
							type: 'GET',
							url: URL2,
							xhrFields: { withCredentials: true },
							crossDomain: true,
							dataType: 'json',
							success: (responseData) => {
								this.planes = responseData
								mui.busy(false)
							}

						})

						URL2 =  URL + '' + '/clientes/' + this.alumno.username + '/plan_asignado'
						mui.busy(true)
						await $.ajax({
							type: 'GET',
							url: URL2,
							xhrFields: { withCredentials: true },
							crossDomain: true,
							dataType: 'json',
							success: (responseData)=>{
								this.plan_actual = responseData
								mui.busy(false)
							},
							error: (responseData)=>{
								mui.busy(false)
								this.plan_actual = "No hay plan actual";
							}

						})

						
					},

					abrirDiaSesionNueva: function (value1, value2) {
						ejerciciosSesion.ejercicios = this.planes[value1].dias[value2].ejercicios
						ejerciciosSesion.planSerial = value1
						ejerciciosSesion.diaSerial = value2
						ejerciciosSesion.alumno = this.alumno
						mui.viewport.showPage("nuevaSesionEjercicios-page", "SLIDE_LEFT")
					},
					volverHome: function() {
						mui.viewport.showPage("home-page", "SLIDE_RIGHT")
					}
				},
				vuetify: new Vuetify()
			})

			const alumnoNuevo = new Vue({
				el: "#nuevoAlumno-page",
				data: {
					alumno: {
						nombre: "",
						apellido: "",
						fecha_nacimiento: "",
						nro_contacto: "",
						mail: ""
					}
				},
				methods: {
					confirmarAlumno: function () {
						if(this.alumno.nombre != "" && this.alumno.apellido != "" && this.alumno.fecha_nacimiento != "" && this.alumno.nro_contacto != "" && this.alumno.mail != "") {
							mui.busy(true)
							$.ajax({
								type: 'POST',
								url: URL + '/clientes/',
								xhrFields: { withCredentials: true },
								crossDomain: true,
								data: {
									'nombre': this.alumno.nombre + " " + this.alumno.apellido,
									'username': this.alumno.nombre.split(" ")[0].toLowerCase() + "." + this.alumno.apellido.split(" ")[0].toLowerCase(),
									'admin': false,
									'password': this.alumno.apellido.split(" ")[0].toLowerCase(),
									'fecha_nacimiento': this.alumno.fecha_nacimiento,
									'nro_contacto': this.alumno.nro_contacto,
									'mail': this.alumno.mail
								},
								dataType: 'json',
								success: (responseData) => {
									mui.busy(false)
									alert(responseData)
								}

							})
							homePage.alumnos.push(this.alumno)
							this.alumno.nombre = ""
							this.alumno.apellido = ""
							this.alumno.fecha_nacimiento = ""
							this.alumno.nro_contacto = ""
							this.alumno.mail = ""
							mui.viewport.showPage("home-page", "SLIDE_RIGHT")
						}
					}
				},
				vuetify: new Vuetify()
			})

			const verAlumno = new Vue({
				el: "#visualizarAlumno-page",
				data: {
					alumno: {
						nombre: "",
						apellido: "",
						fecha_nacimiento: "",
						nro_contacto: "",
						mail: "",
						username: ""
					}
				},
				methods: {
					eliminarAlumno: function() {
						username = this.alumno.username
						mui.busy(true)
						$.ajax({
							type: 'POST',
							url: URL + '/clientes/' + username + "/borrar",
							xhrFields: { withCredentials: true },
							crossDomain: true,
							success: function(data){
								mui.busy(false)
								alert("Eliminado")
							}
						})
						return false
					}
				},
				vuetify: new Vuetify()
			})

			const planNuevo = new Vue({
				el: "#planNuevo-page",
				data: {
					alumno: "",
					nombrePlan: '',
					dias: [],
					nombreDia: "",
				},
				methods: {
					agregarDia: function () {
						diaAux = {
							nombre: this.nombreDia,
							ejercicios: []
						}
						if (this.nombreDia != "") {
							this.dias.push(diaAux)
						}
						
					},
					quitarDia: function () {
						this.dias.pop()
					},
					diaNuevo: function (value) {
						diaNuevo.ejercicios = this.dias[value].ejercicios
						diaNuevo.indiceDia = value
						diaNuevo.nombreDia = this.dias[value].nombre
						mui.viewport.showPage("diaNuevo-page", "SLIDE_LEFT")
					},
					confirmarPlan: function () {
						if (this.nombrePlan != "" && this.dias.length > 0) {
							var planAux = {
								nombre: this.nombrePlan,
								dias: this.dias
							}
							console.log(planAux)
							mui.busy(true)
							$.ajax({
								type: 'POST',
								url: URL + '/clientes/' + this.alumno.username + '/planes',
								xhrFields: { withCredentials: true },
								crossDomain: true,
								data: {
									'nombre': this.nombrePlan,
								},
								dataType: 'json',
								success: (responseData) => {
									for (let i = 0; i < this.dias.length; i++) {
										$.ajax({
											type: 'POST',
											url: URL + '/clientes/' + this.alumno.username + '/planes/' + responseData._id + '/dias',
											xhrFields: { withCredentials: true },
											crossDomain: true,
											data: {
												'nombre': this.dias[i].nombre,
												'ejercicios': this.dias[i].ejercicios
											},
											dataType: 'json',
											success: (responseData2) => {
												for (let j = 0; j < this.dias[i].ejercicios.length; j++) {
													$.ajax({
														type: 'POST',
														url: URL + '/clientes/' + this.alumno.username + '/planes/' + responseData._id + '/dias/' + responseData2._id + '/ejercicios',
														xhrFields: { withCredentials: true },
														crossDomain: true,
														data: {
															'nombre': this.dias[i].ejercicios[j].nombre,
															'intensidad': this.dias[i].ejercicios[j].intensidad,
															'repeticiones': this.dias[i].ejercicios[j].repeticiones,
															'series': this.dias[i].ejercicios[j].series,
															'tiempo': this.dias[i].ejercicios[j].tiempo
														},
														dataType: 'json',
														success: (r) => {
															mui.busy(false)
															console.log(r)
														}
													})
												}
											}
										})
									}
								}
							})
							mui.viewport.showPage("home-page", "SLIDE_RIGHT")
						}
					}
				},
				vuetify: new Vuetify()
			})


			const diaNuevo = new Vue({
				el: '#diaNuevo-page',
				data: {
					indiceDia: 0,
					nombreDia: "",
					ejercicios: []
				},
				methods: {
					agregarEjercicio: function () {
						var ejercicio = {
							nombre: "",
							series: "",
							repeticiones: "",
							intensidad: "",
							tiempo: ""
						}
						this.ejercicios.push(ejercicio)
					},
					quitarEjercicio: function () {
						this.ejercicios.pop()
					},
					confirmarEjercicio: function () {
						planNuevo.dias[this.indiceDia].ejercicios = this.ejercicios
						this.ejercicios = []
						mui.viewport.showPage("planNuevo-page", "SLIDE_RIGHT")
					}
				},
				vuetify: new Vuetify()
			})
			

			const ejerciciosSesion = new Vue({
				el: '#nuevaSesionEjercicios-page',
				data: {
					alumno: "",
					planSerial: 0,
					diaSerial: 0,
					ejercicios: []
				},
				methods: {
					confirmarSesionEjercicios: function() {
						for (i in this.ejercicios) {
							var sesionAux = {
								nombre: "",
								series: "",
								repeticiones: "",
								intensidad: "",
								tiempo: ""
							}
							var ejercicioAux = this.ejercicios[i]

							sesionAux.nombre = ejercicioAux.nombre,
							sesionAux.series = ejercicioAux.series,
							sesionAux.repeticiones = ejercicioAux.repeticiones,
							sesionAux.intensidad = ejercicioAux.intensidad,
							sesionAux.tiempo = ejercicioAux.tiempo
							
							var planId = nuevaSesion.planes[this.planSerial]._id
							var diaId = nuevaSesion.planes[this.planSerial].dias[this.diaSerial]._id
							var ejercicioId = this.ejercicios[i]._id

							URL2 = URL + '' + '/clientes/' + this.alumno.username +"/planes/" + planId + "/dias/" + diaId + "/ejercicios/" + ejercicioId + "/sesiones"
							mui.busy(true)
							$.ajax({
								type: 'POST',
								url: URL2,
								xhrFields: { withCredentials: true },
								crossDomain: true,
								data: {
									"nombre": sesionAux.nombre,
									"series": sesionAux.series,
									"intensidad": sesionAux.intensidad,
									"tiempo": sesionAux.tiempo,
									"repeticiones": sesionAux.repeticiones
								},
								dataType: 'json',
								success: (responseData)=>{
									mui.busy(false)
								}
							})

						}
						this.ejercicios = []
						mui.viewport.showPage("nuevaSesion-page", "SLIDE_RIGHT")
					}
				},
				vuetify: new Vuetify()
			})

			const verPlanes = new Vue({
				el: '#visualizarPlanes-page',
				data: {
					alumno: '',
					planes: []
				},
				methods: {
					abrirEjerciciosVisualizar: function (dia) {
						verEjercicios.ejercicios = dia.ejercicios
						verEjercicios.diaNombre = dia.nombre
						mui.viewport.showPage("visualizarEjercicios-page", "SLIDE_LEFT")
					},
					async cargarPlanes() {
						URL2 = URL + '' + '/clientes/' + this.alumno.username + '/planes'
						mui.busy(true)
						await $.ajax({
							type: 'GET',
							url: URL2,
							xhrFields: { withCredentials: true },
							crossDomain: true,
							dataType: 'json',
							success: (responseData) => {
								mui.busy(false)
								this.planes = responseData
							}

						})
					}
				},
				vuetify: new Vuetify()
			})

			const verEjercicios = new Vue({
				el: '#visualizarEjercicios-page',
				data: {
					diaNombre:"",
					ejercicios: []
				},
				methods: {
					verSesiones: function(value) {
						verSesiones.sesiones = this.ejercicios[value].sesiones
						verSesiones.nombreEjercicio = this.ejercicios[value].nombre
						mui.viewport.showPage("visualizarSesiones-page", "SLIDE_LEFT")
					}
				},
				vuetify: new Vuetify()
			})

			const verSesiones = new Vue({
				el: '#visualizarSesiones-page',
				data: {
					nombreEjercicio: "",
					sesiones: []
				},
				methods: {},
				vuetify: new Vuetify()
			})

			const asignarPlan = new Vue({
				el: '#asignarPlan-page',
				data: {
					alumno: '',
					planes: [],
					id_planSeleccionado: '',
					plan_actual: ''
				},
				methods: {
					async cargarPlanes(){
						URL2 =  URL + '' + '/clientes/' + this.alumno.username + '/planes'
						mui.busy(true)
						await $.ajax({
							type: 'GET',
							url: URL2,
							xhrFields: { withCredentials: true },
							crossDomain: true,
							dataType: 'json',
							success: (responseData)=>{
								mui.busy(false)
								this.planes = responseData
							}

						})
						
						URL2 =  URL + '' + '/clientes/' + this.alumno.username + '/plan_asignado'
						mui.busy(true)
						await $.ajax({
							type: 'GET',
							url: URL2,
							xhrFields: { withCredentials: true },
							crossDomain: true,
							dataType: 'json',
							success: (responseData)=>{
								this.plan_actual = responseData
								mui.busy(false)
							},
							error: (responseData)=>{
								this.plan_actual = "No hay plan actual";
								mui.busy(false)
							}

						})

					},

					asignarPlanSeleccionado: function(){

						URL2 = URL + '' + '/clientes/' + this.alumno.username +"/plan_asignado"
						mui.busy(true)
						$.ajax({
							type: 'POST',
							url: URL2,
							xhrFields: { withCredentials: true },
							crossDomain: true,
							data: {
								plan_asignado: this.id_planSeleccionado
							},
							dataType: 'json',
							success: (responseData)=>{
								mui.busy(false)
							}
						})
						
					}
				},
				vuetify: new Vuetify()
			})

			
			const menuPanel = new Vue({
				el: "#menu-panel",
				methods:{
					logout: function(){
						mui.busy(true)
						$.ajax({
							type: 'GET',
							url: URL + '/logout',
							xhrFields: { withCredentials: true },
							crossDomain: true,
							success: function(data){
								mui.busy(false)
								document.location.href = "index.html"
							}
						})
					},
					irachangepassword: function(){
						mui.viewport.showPage("changepassword-page", "SLIDE_LEFT");
					}
				},
				vuetify: new Vuetify()
			})
		})