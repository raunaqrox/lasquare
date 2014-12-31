$(document).ready(function(){

/*
    //socket object
    var socket; 
    var canvas,ctx,me; 
    var userId = -1;
    var dew = [];
    var otherPlayers = [];
    var roomId;
    var dewX = [];
    var dewY = [];
    var score = 0;
    var scoreCanvas,scoreCtx;
    var alive = true;

    function init(){

        scoreCanvas = document.getElementById('myScore');
        scoreCtx = scoreCanvas.getContext('2d');
        putScore();
        canvas = document.getElementById('myCanvas');
        ctx = canvas.getContext('2d');
        var randomX = random(0,500);
        var randomY = random(0,500);
        me = new Square(randomX,randomY,35,35,"#e21",10);
        me.draw(); 
        socket = io();

    }
    
    function random(low,high){

        return Math.floor(Math.random()*(high-low)+low);

    }
    
    function putScore(){

        scoreCtx.clearRect(0,0,scoreCanvas.width,scoreCanvas.height);
        scoreCtx.fillStyle = "#e21";
        scoreCtx.font = "40px Georgia";
        scoreCtx.fillText(score,0,35);

    }

    function addToScore(s){

        score += s;
        putScore();
    }

    function generateMountainDew(){

        var temp = {};
        temp.x = [];
        temp.y = [];
        if(userId===0){
            for(var i = 0;i<2;i++){
                var randomX = random(0,500); 
                var randomY = random(0,500);
                dew.push(new Square(randomX,randomY,10,10,"#6fe63a",0)); 
                dew[i].draw();
                temp.x[i] = randomX;
                temp.y[i] = randomY;
                temp.room = roomId;
                socket.emit('mountainDewPos', temp);
            }
        }else{ 
                for(var j = 0;j<2;j++){
                    dew.push(new Square(dewX[j],dewY[j],10,10,"#6fe63a",0)); 
                    dew[j].draw();
            }
        }
   }
            
    function Square(x,y,width,height,color,velocity){
   
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.color = color;
        this.isMoving = false;
        return this;
   
    } 
   
    Square.prototype.draw = function(){
        ctx.clearRect(this.x,this.y,this.width,this.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
    };
    
    Square.prototype.collisionDetection = function(){
        // Collision with DEW
        for(var i=0;i<dew.length;i++){
            if(dew[i].x<this.x+this.width && dew[i].x+dew[i].width > this.x && dew[i].y<this.y+this.height && dew[i].y+dew[i].height>this.y){
                dew[i].erase();
                dew.splice(i,1);
                this.velocity += 10;
                var temp = {};
                temp.uid = userId;
                temp.room = roomId;
                socket.emit('mountainDew',temp);
                addToScore(5);
            }
        }

        // Collision with other squares
        for(i = 0; i<otherPlayers.length ;i++){
            console.log(otherPlayers[i]);
            if(otherPlayers[i].x < this.x + this.width && otherPlayers[i].x + otherPlayers[i].width > this.x && otherPlayers[i].y<this.y + this.height && otherPlayers[i].y + otherPlayers[i].height>this.y){
                otherPlayers[i].erase();
                otherPlayers.splice(i,1);
                score += 1;
                var temp = {};
                temp.uid = i;
                temp.room = roomId;
                socket.emit('killed',temp);
                console.log("this "+this.isMoving);
                console.log(otherPlayers[i].isMoving);
            }
        }
    };
      
     
    Square.prototype.erase = function(){

        ctx.clearRect(this.x,this.y,this.width,this.height);
    }; 

    Square.prototype.moveUp = function(){

        if(this.y>0){
            this.collisionDetection();
            ctx.fillStyle = this.color;
            ctx.clearRect(this.x,this.y,this.width,this.height);
            this.y = this.y-this.velocity;
            ctx.fillRect(this.x,this.y,this.width,this.height);
            var toSend = this;
            toSend.dir = "up";
            socket.emit('move',toSend);
        } 
        this.isMoving = false; 
    };

    Square.prototype.moveLeft = function(){

        if(this.x>0){
            this.collisionDetection();
            ctx.fillStyle = this.color;
            ctx.clearRect(this.x,this.y,this.width,this.height);
            this.x = this.x-this.velocity;
            ctx.fillRect(this.x,this.y,this.width,this.height);
            var toSend = this;
            toSend.uid = userId;
            toSend.dir = "left";
            socket.emit('move',toSend);
        } 
        this.isMoving = false; 
    };

    Square.prototype.moveRight = function(){

        if(this.x+this.width<500){
            this.collisionDetection();
            ctx.fillStyle = this.color;
            ctx.clearRect(this.x,this.y,this.width,this.height);
            this.x = this.x+this.velocity;
            ctx.fillRect(this.x,this.y,this.width,this.height);
            var toSend = this;
            toSend.uid = userId;
            toSend.dir = "right";
            socket.emit('move',toSend);
        }
        this.isMoving = false; 
    };

    Square.prototype.moveDown = function(){

        if(this.y+this.height<500){
            this.collisionDetection();
            ctx.fillStyle = this.color;
            ctx.clearRect(this.x,this.y,this.width,this.height);
            this.y = this.y+this.velocity;
            ctx.fillRect(this.x,this.y,this.width,this.height);
            var toSend = this;
            toSend.uid = userId;
            toSend.dir = "down";
            socket.emit('move',toSend);
        }
        this.isMoving = false; 
    };

     init();

     //
     // keypress
     //
    
     $(document).keypress(function(e){
        if(alive){
           // console.log(e.which);
            //w a s d

            // w or up arrow key
            if(e.which == 119|| e.keyCode == 119 || e.which == 38 || e.keyCode == 38){
                me.moveUp();
                me.isMoving = true;
            }

            //a
            if(e.which == 97|| e.keyCode == 97){

                me.moveLeft(); 
                me.isMoving = true;
            }

            // s
            if(e.which == 115|| e.keyCode == 115){
     
                me.moveDown(); 
                me.isMoving = true;
            }

            // d
            if(e.which == 100 || e.keyCode == 100){
                
                me.moveRight(); 
                me.isMoving = true;
            }
        }
    });

    function moveThat(userId, direction){
        switch(direction){

            case "up":
                otherPlayers[userId-1].moveUp();
                break;
            case "down":
                otherPlayers[userId-1].moveDown();
                break;
            case "left":
                otherPlayers[userId-1].moveLeft();
                break;
            case "right":
                otherPlayers[userId-1].moveRight();
                break;
        }
    }

    socket.on('move',function(data){
        var uid = data.uid;
        var dir = data.dir;
        moveThat(uid,dir);
    });

    socket.on('join', function(data){
        var temp = new Square(data.x,data.y,data.width,data.height,data.color,data.velocity);
        temp.draw(); 
        otherPlayers.push(temp);
        var toSend = {};
        toSend.otherPlayers = otherPlayers;
        toSend.room = myRoom;
        socket.emit('allPlayersSoFar', toSend);    
        socket.emit('mountainDewPos', temp);
    });

    socket.on('myId', function(id){
        if(userId === -1){
            userId = id;
            me.uid = userId;
            me.room = roomId;
        }
        socket.emit('join',me);
        if(userId === 0){
            generateMountainDew();
        } 
    });  

    socket.on('myRoom', function(myRoom){
        roomId = myRoom;
        me.room = roomId;
    });

    socket.on('mountainDewPos', function(data){
        for(var i = 0;i<2;i++){
            dewX[i] = data.x[i];
            dewY[i] = data.y[i]; 
        }
        if(userId!==0){
            generateMountainDew();
        }
    });

    socket.on('mountainDew', function(data){
        if(dew.length != 1){
            otherPlayers[data.uid-1].velocity+=10;
        }
    });
    socket.on('killed', function(data){
        addToScore(10);                 
    });
    socket.on('allPlayersSoFar', function(data){
        otherPlayers = data.otherPlayers;
        for(var i=0;i<otherPlayers.length;i++){
            otherPlayers[i].draw();
        }        
    });

*/


var canvas,ctx;
var me;
var score,sctx;
var info,ictx;

function init (){

    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    score = document.getElementById('myScore');
    sctx = score.getContext('2d');
    info = document.getElementById('myInfo');
    ictx = info.getContext('2d');
    var color = randomColor();
    me = new Player(random(10,440), random(10,440), 40, 40,color);
    me.draw();
    drawBorder();
    setScore(0);
    getStatus();
}

function setScore(s){
    sctx.clearRect(10,30,50,50);
    sctx.fillStyle = randomColor();
    sctx.font = "40px Georgia";
    sctx.fillText(s,10,30,50,50);
}

function clearInfo(){
    ictx.clearRect(0,0,info.width,info.height);
}

function infoText(s,y){
    ictx.fillStyle = randomColor();
    ictx.font = "18px Georgia";
    ictx.fillText(s,10,y,70,70);
}

function getStatus(){
    clearInfo();
    infoText("alive : "+me.alive,30);
    infoText("stuck : "+me.isStuck,60);
    
}

function drawBorder(){ 

    ctx.lineWidth   = 5;
    ctx.strokeStyle = randomColor();
    ctx.strokeRect(5,5,490,490);

}

function Player (x, y, width, height, color, name){ 
 
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.velocity = 15;
    this.alive = true;
    this.isMoving = false;
    this.name = name; 
    this.isStuck = false;

}

function MountainDew (point,x,y,width,height,color){
    
    this.x = x;
    this.y = y;
    this.width = point * width;
    this.height = point * height;
    this.color = color;

}

Player.prototype.draw = function (){

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.width,this.height);

};

function random (low, high){
    
    return Math.floor(Math.random() * (high - low) + low);

}

function randomColor (){

    var color = "#";
    var toSelectFrom = "0123456789ABCDEF";
    for(var i = 0; i<6; i++){
        var j = random(0,16); 
        color += toSelectFrom[j];
    }
    return color;

}

$(document).keypress(function(e){
    if(me.alive && !me.isStuck){
      
        // console.log(e.which);
        
        //w a s d

        // w or up arrow key

        if(e.which == 119|| e.keyCode == 119 || e.which == 38 || e.keyCode == 38){
            me.moveUp();
            me.isMoving = true;
        }

        //a
        if(e.which == 97|| e.keyCode == 97){

            me.moveLeft(); 
            me.isMoving = true;
        }

        // s
        if(e.which == 115|| e.keyCode == 115){
 
            me.moveDown(); 
            me.isMoving = true;
        }

        // d
        if(e.which == 100 || e.keyCode == 100){
            
            me.moveRight(); 
            me.isMoving = true;
        }
    }else{
        var tempFlag = true;
        getStatus();
        if(tempFlag){ 
            setTimeout(function(){
                me.isStuck = false;                    
                getStatus();
            },5000);
            tempFlag = false;
        }
    }
});
 
Player.prototype.collisionDetection = function(b){

    if(b.x < this.x + this.width && b.x + b.width > this.x && b.y < this.y + this.height && b.y + b.height > this.y){
        alert('collision');
    } 

};

Player.prototype.moveUp = function(){
    if(!this.isStuck){
        if(this.y>10){
            //this.collisionDetection();
            ctx.fillStyle = this.color;
            ctx.clearRect(this.x,this.y,this.width,this.height);
            this.y = this.y-this.velocity;
            ctx.fillRect(this.x,this.y,this.width,this.height);
   /*       var toSend = this;
            toSend.dir = "up";
            socket.emit('move',toSend);
    */    }
        else{
                this.isStuck = true;
        }
    } 
        this.isMoving = false; 
};

Player.prototype.moveLeft = function(){
    if(!this.isStuck){
        if(this.x>10){
           // this.collisionDetection();
            ctx.fillStyle = this.color;
            ctx.clearRect(this.x,this.y,this.width,this.height);
            this.x = this.x-this.velocity;
            ctx.fillRect(this.x,this.y,this.width,this.height);
/*          var toSend = this;
            toSend.uid = userId;
            toSend.dir = "left";
            socket.emit('move',toSend);
  */      }
        else{
                this.isStuck = true;
        }
    } 

        this.isMoving = false; 
};

Player.prototype.moveRight = function(){
    if(!this.isStuck){
        if(this.x+this.width < 490){
            //this.collisionDetection();
            ctx.fillStyle = this.color;
            ctx.clearRect(this.x,this.y,this.width,this.height);
            this.x = this.x+this.velocity;
            ctx.fillRect(this.x,this.y,this.width,this.height);
   /*       var toSend = this;
            toSend.uid = userId;
            toSend.dir = "right";
            socket.emit('move',toSend);
 */       }
        else{
                this.isStuck = true;
            }
        } 

        this.isMoving = false; 
};

Player.prototype.moveDown = function(){
    if(!this.isStuck){
        if(this.y+this.height < 490){
            //this.collisionDetection();
            ctx.fillStyle = this.color;
            ctx.clearRect(this.x,this.y,this.width,this.height);
            this.y = this.y+this.velocity;
            ctx.fillRect(this.x,this.y,this.width,this.height);
/*          var toSend = this;
            toSend.uid = userId;
            toSend.dir = "down";
            socket.emit('move',toSend);
*/        }
        else{
                this.isStuck = true;
            } 
        }

        this.isMoving = false; 
};

init();

});
