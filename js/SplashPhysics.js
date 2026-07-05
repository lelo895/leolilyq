export default class SplashPhysics {
  constructor(items, staticColliders, callbacks) {
    this.items = items;
    this.staticColliders = staticColliders || [];
    this.callbacks = callbacks || {};
    this.active = false;
    this.activeDragItem = null;
    this.startClientX = 0;
    this.startClientY = 0;
    this.animationFrameId = null;

    this.handleStart = this.handleStart.bind(this);
    this.drag = this.drag.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.physicsLoop = this.physicsLoop.bind(this);
  }

  getSpawnX(itemWidth, side) {
    if (window.innerWidth <= 600) {
      return Math.random() * (window.innerWidth - itemWidth);
    }
    const centerStart = (window.innerWidth - 300) / 2;
    const centerEnd = centerStart + 300;

    if (side === 'left') {
      return Math.random() * (centerStart - itemWidth);
    } else {
      return centerEnd + Math.random() * (window.innerWidth - centerEnd - itemWidth);
    }
  }

  start() {
    if (this.active) return;
    this.active = true;
    this.items.forEach(item => {
      if (!item.el) return;
      item.el.style.position = 'absolute';
      item.el.style.left = '0';
      item.el.style.top = '0';
      item.el.style.margin = '0';
      item.el.style.transition = 'none';

      item.el.addEventListener('mousedown', this.handleStart);
      item.el.addEventListener('touchstart', this.handleStart, { passive: false });
    });
    window.addEventListener('mousemove', this.drag);
    window.addEventListener('mouseup', this.endDrag);
    window.addEventListener('touchmove', this.drag, { passive: false });
    window.addEventListener('touchend', this.endDrag);
    this.animationFrameId = requestAnimationFrame(this.physicsLoop);
  }

  stop() {
    this.active = false;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.items.forEach(item => {
      if (!item.el) return;
      item.el.removeEventListener('mousedown', this.handleStart);
      item.el.removeEventListener('touchstart', this.handleStart);
    });
    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.endDrag);
    window.removeEventListener('touchmove', this.drag);
    window.removeEventListener('touchend', this.endDrag);
  }

  handleStart(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    this.startClientX = clientX;
    this.startClientY = clientY;

    if (!this.active) return;

    let itemEl = e.currentTarget;
    let item = this.items.find(i => i.el === itemEl);
    if (!item) return;

    this.activeDragItem = item;
    
    if (item.onDragStart) {
      item.onDragStart(item);
    }

    item.dragOffsetX = clientX - item.x;
    item.dragOffsetY = clientY - item.y;
    item.vx = 0;
    item.vy = 0;

    if (this.callbacks.onInteract) this.callbacks.onInteract(item);
  }

  drag(e) {
    if (!this.activeDragItem || !this.active) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const prevX = this.activeDragItem.x;
    const prevY = this.activeDragItem.y;

    this.activeDragItem.x = clientX - this.activeDragItem.dragOffsetX;
    this.activeDragItem.y = clientY - this.activeDragItem.dragOffsetY;
    this.activeDragItem.vx = this.activeDragItem.x - prevX;
    this.activeDragItem.vy = this.activeDragItem.y - prevY;
  }

  endDrag() {
    if (this.activeDragItem && this.callbacks.onSettle) {
      this.callbacks.onSettle(this.activeDragItem);
    }

    if (this.activeDragItem && this.activeDragItem.el) {
      this.activeDragItem.el.classList.add('has-been-dragged');
    }

    this.activeDragItem = null;
  }

  physicsLoop() {
    if (!this.active) return;

    this.items.forEach(item => {
      if (!item.el) return;

      const isOffScreen = item.y < -item.height || item.y > window.innerHeight || item.x < -item.width || item.x > window.innerWidth;
      if (isOffScreen) {
        if (!item.offScreenSince) item.offScreenSince = Date.now();
        else if (Date.now() - item.offScreenSince > 3000) {
          if (this.activeDragItem === item) this.activeDragItem = null;
          if (item.id === 'journal') {
            item.x = (window.innerWidth - item.width) / 2;
          } else {
            if (item.onReset) {
              item.onReset(item);
            }
            item.side = item.side === 'left' ? 'right' : 'left';
            item.x = this.getSpawnX(item.width, item.side);
          }
          item.y = -500;
          item.vx = (Math.random() - 0.5) * 6;
          item.vy = 0;
          item.offScreenSince = null;
        }
      } else {
        item.offScreenSince = null;
      }

      if (this.activeDragItem !== item) {
        const prevVy = item.vy;
        item.vy += item.gravity;
        item.x += item.vx;
        item.y += item.vy;

        const floor = window.innerHeight - item.height;
        if (item.y > floor) {
          item.y = floor;
          item.vy *= item.bounce;
          item.vx *= item.friction;
          if (prevVy > 3) {
            const now = Date.now();
            if (!item.lastColTime || now - item.lastColTime > 100) {
              if (this.callbacks.onCollision) this.callbacks.onCollision(item.id, prevVy);
              item.lastColTime = now;

              if (item.onBounce) {
                item.onBounce(item, prevVy);
              }
            }
          }
        }

        const rightWall = window.innerWidth - item.width;
        const leftWall = 0;

        if (item.x > rightWall) {
          item.x = rightWall;
          item.vx *= item.bounce;
        } else if (item.x < leftWall) {
          item.x = leftWall;
          item.vx *= item.bounce;
        }

        for (let j = 0; j < this.items.length; j++) {
          const other = this.items[j];
          if (item === other || !other.el || this.activeDragItem === other) continue;

          if (item.x < other.x + other.width &&
            item.x + item.width > other.x &&
            item.y < other.y + other.height &&
            item.y + item.height > other.y) {

            const dx = (item.x + item.width / 2) - (other.x + other.width / 2);
            const dy = (item.y + item.height / 2) - (other.y + other.height / 2);

            if (Math.abs(dx) > Math.abs(dy)) {
              if (dx > 0) { item.x += 1; other.x -= 1; }
              else { item.x -= 1; other.x += 1; }
              const tempVx = item.vx;
              item.vx = other.vx * 0.8;
              other.vx = tempVx * 0.8;
            } else {
              if (dy > 0) { item.y += 1; other.y -= 1; }
              else { item.y -= 1; other.y += 1; }
              const tempVy = item.vy;
              item.vy = other.vy * 0.8;
              other.vy = tempVy * 0.8;
            }

            let impact = Math.abs(item.vx) + Math.abs(item.vy) + Math.abs(other.vx) + Math.abs(other.vy);
            impact *= 0.15;

            if (impact > 1) {
              const now = Date.now();
              if (!item.lastColTime || now - item.lastColTime > 100) {
                if (this.callbacks.onCollision) this.callbacks.onCollision(item.id, impact);
                item.lastColTime = now;
              }
            }
          }
        }

        // Generic static collisions
        this.staticColliders.forEach(collider => {
           if (collider.isActive && !collider.isActive()) return;
           
           const cX = collider.x;
           const cY = collider.y;
           const cW = collider.width;
           const cH = collider.height;
           
           if (item.x < cX + cW &&
               item.x + item.width > cX &&
               item.y < cY + cH &&
               item.y + item.height > cY) {
                 
             const dx = (item.x + item.width / 2) - (cX + cW / 2);
             const dy = (item.y + item.height / 2) - (cY + cH / 2);

             if (Math.abs(dx) > Math.abs(dy)) {
               if (dx > 0) { item.x = cX + cW; }
               else { item.x = cX - item.width; }
               item.vx *= item.bounce;
             } else {
               if (dy > 0) { item.y = cY + cH; }
               else { item.y = cY - item.height; }
               item.vy *= item.bounce;
             }
           }
        });
      }

      if (item.onUpdate) {
        item.onUpdate(item, this.activeDragItem === item);
      } else {
        item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
      }
    });

    this.animationFrameId = requestAnimationFrame(this.physicsLoop);
  }
}
