import {
	EventDispatcher,
	MOUSE,
	Vector2,
	Vector3,
	Spherical,
	Plane
} from '../three.js/build/three.module.js';

//Author: William https://github.com/WilliamLiu-1997

// This set of controls performs Rotating, dollying (zooming for OrthographicCamera), and panning.
// Pan up / down / left / right  - right mouse, or WASD keys / touch: three finger swipe
// Dolly forward / backward  - mousewheel or WASD keys / touch: two finger spread or squish
// Rotate  - middle mouse, or arrow keys / touch: one finger move

// Compared to OrbitControls:
// 1. It can dolly forward/backward (instead of dolly in/out) and pan left/right/up/down.
// 2. Rotation is centered on the camera itself by default. If the target is set, the rotation will be centered on the target.

class CameraControls extends EventDispatcher {

	constructor(object, domElement) {

		super();

		this.angleX = 0;
		this.angleY = 0;

		this.stop = false;
		this.minZ = -Infinity
		this.maxZ = Infinity

		this.o = new Vector3(0, 0, 0);

		this.object = object;

		//The target of the focus. Tt should be set a vector or false. If a vector is given, the rotation will be centered on it.
		this.target = false;

		// The sensitivity of panning and Dolly
		this.sensitivity = 1;
		// Dynamically change the sensitivity according to the distance between the object and center of the scene
		this.dynamicSensitivity = true;

		this.domElement = (domElement !== undefined) ? domElement : document;

		// Set to false to disable this control
		this.enabled = true;

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.1;

		// "look" sets the direction of the focus, this should not be changed
		this.look = this.o.clone().sub(this.object.position).normalize();

		// How far you can dolly and pan ( PerspectiveCamera only )
		this.maxDistance = Infinity;

		// How far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.invertRotate = false;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.keyPanSpeed = 1.0;// pixels moved per arrow key push
		this.keyRotateSpeed = 1.0;

		// Set to true to automatically rotate
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2;

		// Set to false to disable use of the keys
		this.enableKeys = true;

		// The four arrow keys
		this.keys = { TURNLEFT: 37, TURNUP: 38, TURNRIGHT: 39, TURNBOTTOM: 40, FORWARD: 87, BACKWARD: 83, LEFT: 65, RIGHT: 68 };

		// Mouse buttons
		this.mouseButtons = { PAN: MOUSE.RIGHT, ZOOM: false, ROTATE: MOUSE.MIDDLE };

		// for reset
		this.position0 = this.object.position.clone();
		this.target0 = this.target ? this.target.clone() : false;
		this.zoom0 = this.object.zoom;
		this.look0 = this.look.clone();
		this.angleX0 = this.angleX;
		this.angleY0 = this.angleY;

		//
		// public methods
		//

		this.saveState = function () {

			scope.position0.copy(scope.object.position);
			scope.target0 = scope.target ? scope.target.clone() : false;
			scope.zoom0 = scope.object.zoom;
			scope.look0.copy(scope.look);
			scope.angleX0 = scope.angleX;
			scope.angleY0 = scope.angleY;

		};

		this.reset = function () {
			let old_target = scope.target;
			scope.target = false;

			scope.object.position.copy(scope.position0);
			scope.object.zoom = scope.zoom0;
			scope.look.copy(scope.look0);
			scope.angleX = scope.angleX0;
			scope.angleY = scope.angleY0;

			scope.object.updateProjectionMatrix();
			scope.dispatchEvent(changeEvent);

			scope.update();

			scope.target = old_target ? old_target.clone() : false;

			state = STATE.NONE;

		};

		// this method is exposed, but perhaps it would be better if we can make it private...
		this.update = function () {

			return function update() {

				let position = scope.object.position;
				let target = scope.target;

				if (scope.dynamicSensitivity) {

					if (target) {
						scope.sensitivity = Math.max(0.1, scope.object.position.distanceTo(target));
					}
					else { scope.sensitivity = Math.max(1, Math.abs(scope.object.position.y)); }


				}

				if (scope.autoRotate && state === STATE.NONE) {

					rotate(getAutoRotationAngle(), 0);

				}

				// move position to panned location
				if (scope.enableDamping === true) {

					position.addScaledVector(panOffset, scope.dampingFactor);

				} else {

					position.add(panOffset);

				}

				let low, high;
				if (angleY_gap > 0) {
					low = angleY_gap;
					high = 0;
				} else {
					low = 0;
					high = angleY_gap;
				}

				let last_angleX = scope.angleX;
				let last_angleY = scope.angleY;
				if (scope.enableDamping) {

					scope.angleX += angleXDelta * scope.dampingFactor * 1.2;
					scope.angleY = Math.max(-Math.PI / 2 + 0.001 + low, Math.min(scope.angleY + angleYDelta * scope.dampingFactor * 1.2, Math.PI / 2 - 0.001 + high));

				} else {

					scope.angleX += angleXDelta * 1.5;
					scope.angleY = Math.max(-Math.PI / 2 + 0.001 + low, Math.min(scope.angleY + angleYDelta * 1.5, Math.PI / 2 - 0.001 + high));

				}

				scope.look.x = Math.sin(scope.angleX) * Math.cos(scope.angleY);
				scope.look.z = -Math.cos(scope.angleX) * Math.cos(scope.angleY);
				scope.look.y = Math.sin(scope.angleY);
				scope.look.normalize();
				position.z = Math.min(scope.maxZ, Math.max(scope.minZ, position.z));

				if (target) {

					let Sphere_ = new Spherical();
					Sphere_.setFromVector3(position.clone().sub(target));
					Sphere_.theta -= scope.angleX - last_angleX;

					let Sphere_location_ = new Vector3();
					Sphere_location_.setFromSpherical(Sphere_).add(target);
					position.copy(Sphere_location_);

					let plane = new Plane();
					let normal_ = new Vector3(0, 1, 0);
					plane.setFromCoplanarPoints(position, position.clone().add(scope.look), position.clone().add(normal_));
					let target_point = new Vector3();
					plane.projectPoint(target, target_point);

					let gap = target_point.clone().sub(target);
					position.sub(gap);

					let Sphere = new Spherical();
					Sphere.setFromVector3(position.clone().sub(target));
					Sphere.phi += scope.angleY - last_angleY;
					angleY_gap = scope.angleY - Sphere.phi + Math.PI / 2;

					let Sphere_location = new Vector3();
					Sphere_location.setFromSpherical(Sphere).add(target);
					position.copy(Sphere_location);
					position.add(gap);

				}
				else {
					angleY_gap = 0;
				}

				let distance
				if (target) { distance = position.distanceTo(target); }
				else { distance = position.distanceTo(scope.o); }

				if (distance > scope.maxDistance) {
					if (target) { position.add(position.clone().sub(target).multiplyScalar(scope.maxDistance / distance).sub(position.clone().sub(target)).multiplyScalar(0.2));}
					else { position.add(position.clone().multiplyScalar(scope.maxDistance / distance).sub(position).multiplyScalar(0.2)); }

				}

				let look = position.clone();
				look.add(scope.look);
				scope.object.lookAt(look);

				if (scope.enableDamping === true) {

					angleXDelta *= (1 - scope.dampingFactor * 1.2);
					angleYDelta *= (1 - scope.dampingFactor * 1.2);
					panOffset.multiplyScalar(1 - scope.dampingFactor);

				} else {

					angleXDelta = 0;
					angleYDelta = 0;
					panOffset.set(0, 0, 0);

				}

			};

		}();

		this.dispose = function () {

			scope.domElement.removeEventListener('contextmenu', onContextMenu, false);
			scope.domElement.removeEventListener('mousedown', onMouseDown, false);
			scope.domElement.removeEventListener('wheel', onMouseWheel, false);

			scope.domElement.removeEventListener('touchstart', onTouchStart, false);
			scope.domElement.removeEventListener('touchend', onTouchEnd, false);
			scope.domElement.removeEventListener('touchmove', onTouchMove, false);

			document.removeEventListener('mousemove', onMouseMove, false);
			document.removeEventListener('mouseup', onMouseUp, false);

			window.removeEventListener('keydown', onKeyDown, false);

		};

		//
		// internals
		//

		let scope = this;

		let changeEvent = { type: 'change' };
		let startEvent = { type: 'start' };
		let endEvent = { type: 'end' };

		let STATE = { NONE: - 1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 };

		let state = STATE.NONE;

		let angleXDelta = 0;
		let angleYDelta = 0;
		let angleY_gap = 0;

		let panOffset = new Vector3();

		let rotateStart = new Vector2();
		let rotateEnd = new Vector2();
		let rotateDelta = new Vector2();

		let panStart = new Vector2();
		let panEnd = new Vector2();
		let panDelta = new Vector2();

		let dollyStart = new Vector2();
		let dollyEnd = new Vector2();
		let dollyDelta = new Vector2();


		function getAutoRotationAngle() {

			return -2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

		}

		function rotate(angleX, angleY) {

			if (scope.invertRotate) {

				angleXDelta -= angleX * 0.64;
				angleYDelta += angleY * 0.32;

			} else {

				angleXDelta += angleX * 0.64;
				angleYDelta -= angleY * 0.32;

			}


		}

		let panLeft = function () {

			let v = new Vector3();

			return function panLeft(distance, objectMatrix) {

				v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
				v.multiplyScalar(- distance);

				panOffset.add(v);

			};

		}();

		let panUp = function () {

			let v = new Vector3();

			return function panUp(distance, objectMatrix) {

				v.setFromMatrixColumn(objectMatrix, 1); // get Y column of objectMatrix
				v.multiplyScalar(distance);

				panOffset.add(v);

			};

		}();

		let moveForward = function () {

			let v = new Vector3();

			return function moveForward(distance, objectMatrix) {

				v.setFromMatrixColumn(objectMatrix, 2); // get Z column of objectMatrix

				v.multiplyScalar(-distance);

				panOffset.add(v);

			};

		}();

		// deltaX and deltaY are in pixels; right and down are positive
		let pan = function () {

			return function pan(deltaX, deltaY) {

				let element = scope.domElement === document ? scope.domElement.body : scope.domElement;


				if (scope.object.isPerspectiveCamera) {
					// half of the fov is center to top of screen
					let targetDistance = Math.tan((scope.object.fov / 2) * Math.PI / 180.0) * 2;

					panLeft(deltaX * targetDistance / element.clientHeight, scope.object.matrix);
					panUp(deltaY * targetDistance / element.clientHeight, scope.object.matrix);

				} else if (scope.object.isOrthographicCamera) {

					// orthographic
					panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
					panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);

				} else {

					// camera neither orthographic nor perspective
					console.warn('WARNING: CameraControls.js encountered an unknown camera type - pan disabled.');
					scope.enablePan = false;

				}

			};

		}();

		function dollyForward(dollyScale) {

			if (scope.object.isPerspectiveCamera) {

				let element = scope.domElement === document ? scope.domElement.body : scope.domElement;
				let targetDistance = Math.tan((scope.object.fov / 2) * Math.PI / 180.0) * 2000;
				moveForward(-0.1 * scope.sensitivity * targetDistance / element.clientHeight * dollyScale, scope.object.matrix);

			} else if (scope.object.isOrthographicCamera) {

				scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * Math.pow(0.95, dollyScale)));
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn('WARNING: CameraControls.js encountered an unknown camera type - dolly/zoom disabled.');
				scope.enableZoom = false;

			}

		}

		function dollyBackward(dollyScale) {

			if (scope.object.isPerspectiveCamera) {

				let element = scope.domElement === document ? scope.domElement.body : scope.domElement;
				let targetDistance = Math.tan((scope.object.fov / 2) * Math.PI / 180.0) * 2000;
				moveForward(0.1 * scope.sensitivity * targetDistance / element.clientHeight * dollyScale, scope.object.matrix);

			} else if (scope.object.isOrthographicCamera) {

				scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / Math.pow(0.95, dollyScale)));
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn('WARNING: CameraControls.js encountered an unknown camera type - dolly/zoom disabled.');
				scope.enableZoom = false;

			}

		}

		//
		// event callbacks - update the object state
		//

		function handleMouseDownRotate(event) {

			rotateStart.set(event.clientX, event.clientY);

		}

		function handleMouseDownDolly(event) {

			dollyStart.set(event.clientX, event.clientY);

		}

		function handleMouseDownPan(event) {

			panStart.set(event.clientX, event.clientY);

		}

		function handleMouseMoveRotate(event) {

			rotateEnd.set(event.clientX, event.clientY);
			rotateDelta.subVectors(rotateEnd, rotateStart);

			let element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			// rotating across whole screen goes 360 degrees around
			rotate(1.2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed, 1.2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

			rotateStart.copy(rotateEnd);

			scope.update();

		}

		function handleMouseMoveDolly(event) {

			dollyEnd.set(event.clientX, event.clientY);

			dollyDelta.subVectors(dollyEnd, dollyStart);

			if (dollyDelta.y > 0) {

				dollyForward(scope.zoomSpeed);

			} else if (dollyDelta.y < 0) {

				dollyBackward(scope.zoomSpeed);

			}

			dollyStart.copy(dollyEnd);

			scope.update();

		}

		function handleMouseMovePan(event) {

			panEnd.set(event.clientX, event.clientY);

			panDelta.subVectors(panEnd, panStart);

			pan(panDelta.x * scope.sensitivity, panDelta.y * scope.sensitivity);

			panStart.copy(panEnd);

			scope.update();

		}

		function handleMouseUp(event) {

		}

		function handleMouseWheel(event) {

			if (event.deltaY < 0) {

				dollyBackward(scope.zoomSpeed);

			} else if (event.deltaY > 0) {

				dollyForward(scope.zoomSpeed);

			}

			scope.update();

		}

		function handleKeyDown(event) {

			let element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			if (scope.enableRotate === true) {

				switch (event.keyCode) {

					case scope.keys.TURNUP:
						rotate(0, -Math.PI / element.clientHeight * scope.keyRotateSpeed);
						scope.update();
						break;

					case scope.keys.TURNBOTTOM:
						rotate(0, Math.PI / element.clientHeight * scope.keyRotateSpeed);
						scope.update();
						break;

					case scope.keys.TURNLEFT:
						rotate(- Math.PI / element.clientWidth * scope.keyRotateSpeed, 0);
						scope.update();
						break;

					case scope.keys.TURNRIGHT:
						rotate(Math.PI / element.clientWidth * scope.keyRotateSpeed, 0);
						scope.update();
						break;

				}

			}

			if (scope.enablePan === true) {

				switch (event.keyCode) {

					case scope.keys.FORWARD:
						dollyBackward(scope.zoomSpeed * scope.keyPanSpeed);;
						scope.update();
						break;

					case scope.keys.BACKWARD:
						dollyForward(scope.zoomSpeed * scope.keyPanSpeed);;
						scope.update();
						break;

					case scope.keys.LEFT:
						pan(20 * scope.keyPanSpeed * scope.sensitivity, 0);
						scope.update();
						break;

					case scope.keys.RIGHT:
						pan(- 20 * scope.keyPanSpeed * scope.sensitivity, 0);
						scope.update();
						break;

				}

			}

		}

		function handleTouchStartRotate(event) {

			rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);

		}

		function handleTouchStartDolly(event) {

			let dx = event.touches[0].pageX - event.touches[1].pageX;
			let dy = event.touches[0].pageY - event.touches[1].pageY;

			let distance = Math.sqrt(dx * dx + dy * dy);

			dollyStart.set(0, distance);

		}

		function handleTouchStartPan(event) {

			panStart.set(event.touches[0].pageX, event.touches[0].pageY);

		}

		function handleTouchMoveRotate(event) {

			rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
			rotateDelta.subVectors(rotateEnd, rotateStart);

			let element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			rotate(1.2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed, 1.2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

			rotateStart.copy(rotateEnd);

			scope.update();

		}

		function handleTouchMoveDolly(event) {

			let dx = event.touches[0].pageX - event.touches[1].pageX;
			let dy = event.touches[0].pageY - event.touches[1].pageY;

			let distance = Math.sqrt(dx * dx + dy * dy);

			dollyEnd.set(0, distance);

			dollyDelta.subVectors(dollyEnd, dollyStart);

			if (dollyDelta.y > 0) {

				dollyBackward(scope.zoomSpeed / 2);

			} else if (dollyDelta.y < 0) {

				dollyForward(scope.zoomSpeed / 2);

			}

			dollyStart.copy(dollyEnd);

			scope.update();

		}

		function handleTouchMovePan(event) {

			panEnd.set(event.touches[0].pageX, event.touches[0].pageY);

			panDelta.subVectors(panEnd, panStart);

			pan(panDelta.x * scope.sensitivity, panDelta.y * scope.sensitivity);

			panStart.copy(panEnd);

			scope.update();

		}

		function handleTouchEnd(event) {

		}

		//
		// event handlers - FSM: listen for events and reset state
		//

		function onMouseDown(event) {

			if (scope.enabled === false) return;

			event.preventDefault();

			switch (event.button) {

				case scope.mouseButtons.ROTATE:

					if (scope.enableRotate === false) return;

					handleMouseDownRotate(event);

					state = STATE.ROTATE;

					break;

				case scope.mouseButtons.ZOOM:

					if (scope.enableZoom === false) return;

					handleMouseDownDolly(event);

					state = STATE.DOLLY;

					break;

				case scope.mouseButtons.PAN:

					if (scope.enablePan === false) return;

					handleMouseDownPan(event);

					state = STATE.PAN;

					break;

			}

			if (state !== STATE.NONE) {

				document.addEventListener('mousemove', onMouseMove, false);
				document.addEventListener('mouseup', onMouseUp, false);

			}

		}

		function onMouseMove(event) {

			if (scope.stop) {

				onMouseUp(event);

			}

			if (scope.enabled === false) return;

			event.preventDefault();

			switch (state) {

				case STATE.ROTATE:

					if (scope.enableRotate === false) return;

					handleMouseMoveRotate(event);

					break;

				case STATE.DOLLY:

					if (scope.enableZoom === false) return;

					handleMouseMoveDolly(event);

					break;

				case STATE.PAN:

					if (scope.enablePan === false) return;

					handleMouseMovePan(event);

					break;

			}

		}

		function onMouseUp(event) {

			if (scope.enabled === false) return;

			handleMouseUp(event);

			document.removeEventListener('mousemove', onMouseMove, false);
			document.removeEventListener('mouseup', onMouseUp, false);

			scope.dispatchEvent(endEvent);

			state = STATE.NONE;

		}

		function onMouseWheel(event) {
			if (scope.stop) {

				return;

			}

			if (scope.enabled === false || scope.enableZoom === false || (state !== STATE.NONE && state !== STATE.ROTATE)) return;

			event.preventDefault();
			event.stopPropagation();

			handleMouseWheel(event);

			scope.dispatchEvent(startEvent); // not sure why these are here...
			scope.dispatchEvent(endEvent);

		}

		function onKeyDown(event) {

			if (scope.enabled === false || scope.enableKeys === false) return;

			handleKeyDown(event);

		}

		function onTouchStart(event) {

			if (scope.enabled === false) return;

			switch (event.touches.length) {

				case 1:	// one-fingered touch: rotate

					if (scope.enableRotate === false) return;

					handleTouchStartRotate(event);

					state = STATE.TOUCH_ROTATE;

					break;

				case 2:	// two-fingered touch: dolly

					if (scope.enableZoom === false) return;

					handleTouchStartDolly(event);

					state = STATE.TOUCH_DOLLY;

					break;

				case 3: // three-fingered touch: pan

					if (scope.enablePan === false) return;

					handleTouchStartPan(event);

					state = STATE.TOUCH_PAN;

					break;

				default:

					state = STATE.NONE;

			}

			if (state !== STATE.NONE) {

				scope.dispatchEvent(startEvent);

			}

		}

		function onTouchMove(event) {

			if (scope.enabled === false) return;

			event.preventDefault();
			event.stopPropagation();

			switch (event.touches.length) {

				case 1: // one-fingered touch: rotate

					if (scope.enableRotate === false) return;
					if (state !== STATE.TOUCH_ROTATE) return; // is this needed?...

					handleTouchMoveRotate(event);

					break;

				case 2: // two-fingered touch: dolly

					if (scope.enableZoom === false) return;
					if (state !== STATE.TOUCH_DOLLY) return; // is this needed?...

					handleTouchMoveDolly(event);

					break;

				case 3: // three-fingered touch: pan

					if (scope.enablePan === false) return;
					if (state !== STATE.TOUCH_PAN) return; // is this needed?...

					handleTouchMovePan(event);

					break;

				default:

					state = STATE.NONE;

			}

		}

		function onTouchEnd(event) {

			if (scope.enabled === false) return;

			handleTouchEnd(event);

			scope.dispatchEvent(endEvent);

			state = STATE.NONE;

		}

		function onContextMenu(event) {

			if (scope.enabled === false) return;

			event.preventDefault();

		}

		scope.domElement.addEventListener('contextmenu', onContextMenu, false);

		scope.domElement.addEventListener('mousedown', onMouseDown, false);
		scope.domElement.addEventListener('wheel', onMouseWheel, false);

		scope.domElement.addEventListener('touchstart', onTouchStart, false);
		scope.domElement.addEventListener('touchend', onTouchEnd, false);
		scope.domElement.addEventListener('touchmove', onTouchMove, false);

		window.addEventListener('keydown', onKeyDown, false);

		// force an update at start
		this.update();

	};
}

export { CameraControls };
