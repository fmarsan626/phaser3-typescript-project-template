export default class MainScene extends Phaser.Scene {
    private platforms: Phaser.Physics.Arcade.StaticGroup;
    private player: Phaser.Physics.Arcade.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private stars: Phaser.Physics.Arcade.Group;
    private score = 0;
    private scoreText: Phaser.GameObjects.Text;
    private bombs: Phaser.Physics.Arcade.Group;


    constructor() {
        super('MainScene');
    }
    /**
     * Prcarga de recursos
     */
    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', {
            frameWidth: 32, frameHeight: 48 //Tamaño de cada frame del sprite
        });

    }
    /**
     * Donde y como estarán los elementos
     */
    create() {
        //Fondo y plataformas
        this.add.image(400, 300, 'sky');
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        //Sprite del jugador
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        //Define las animaciones
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 0, end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 5, end: 8
            }),
            frameRate: 10,
            repeat: -1
        });
        //Añadimos la colision con las plataformas
        this.physics.add.collider(this.player, this.platforms);
        //Añadimos gestor del teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        //Añadimos estrellas
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }//Lugar inicial y distancia entre ellas
        });

        this.stars.children.iterate(c => {
            //Casting porque realmente "c" es un padre de "Image"
            const child = c as Phaser.Physics.Arcade.Image;
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.handleCollectStar, undefined, this);

        //Texto para puntuacion
        this.scoreText = this.add.text(16, 16, 'Puntos: 0', { fontSize: '32px' });

        //Bombas
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);//Añade coliision con las bombas
        this.physics.add.overlap(this.player, this.bombs, this.handleHitBomb, undefined, this);//que pasa al tocarse

    }
    /**
     * Actua en consecuencia de las acciones del usuario
     */
    update() {
        //Instrucciones para el teclado
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    /**
     * Método que indica que se debe hacer invisble la estrella al tocarse los objetos
     */
    private handleCollectStar(player: Phaser.GameObjects.GameObject, s: Phaser.GameObjects.GameObject) {
        const star = s as Phaser.Physics.Arcade.Image;
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Puntos: ' + this.score);

        if (this.stars.countActive(true) === 0) {//Cuenta estrellas activas
            this.stars.children.iterate(c => {
                const child = c as Phaser.Physics.Arcade.Image;
                child.enableBody(true, child.x, 0, true, true);

            });

            const x = (this.player.x < 400) //Coordenada aleatoria opuesta al jugador
                ? Phaser.Math.Between(400, 800) 
                : Phaser.Math.Between(0, 400);
            //Física de la bomba
            const bomb: Phaser.Physics.Arcade.Image = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    private handleHitBomb(player: Phaser.GameObjects.GameObject, b: Phaser.GameObjects.GameObject){
        this.physics.pause();//Detiene el juego
        this.player.setTint(0xff0000);//Pinta al personaje en rojo
        this.player.anims.play('turn');
    }
}
