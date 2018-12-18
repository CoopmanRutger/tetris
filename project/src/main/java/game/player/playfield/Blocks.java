package game.player.playfield;

import game.player.playfield.block.Block;
import game.player.playfield.block.TypesOfBlocks;

import java.awt.*;
import java.util.ArrayList;
import java.util.List;

public class Blocks {

    private List<Block> blocks;
    private Block currentBlock;


    public Block getCurrentBlock() {
        return currentBlock;
    }

    Blocks() {
        blocks = new ArrayList<>();
        MakeBlocks();
    }

    Block getBlock() {
        int amountOfBlocks = blocks.size() - 1;
        Long randomNumber = Math.round((Math.random() * amountOfBlocks));
        int randomNumberToInt = randomNumber.intValue();
        currentBlock = blocks.get(randomNumberToInt);
        return currentBlock;
    }

    public void addBlock(Block block) {
        blocks.add(block);
    }

    public void removeBlock(Block block) {
        blocks.remove(block);
    }


    private void MakeBlocks(){
        Block Lblock = new Block("L-blok", TypesOfBlocks.lBlock, Color.red);
        Block LineBlock = new Block("Line-blok", TypesOfBlocks.lineBlock, Color.blue);
        Block Sblok = new Block("Square-blok", TypesOfBlocks.squareBlock, Color.magenta);
        Block Tblok = new Block("T-blok", TypesOfBlocks.tBlock, Color.orange);
        Block Zblok = new Block("Z-blok", TypesOfBlocks.zBlock, Color.yellow);
        Block ILblock= new Block("IL-block", TypesOfBlocks.inverseLBlock, Color.GREEN);
        Block Nblock = new Block("N-blok", TypesOfBlocks.leftNBlock, Color.pink);
        Block specialBock = new Block("SP-blok", TypesOfBlocks.leftNBlock, Color.white);

        Lblock.makeBlock(2,0,1,3);
        LineBlock.makeBlock(0,0,4,0);
        Sblok.makeBlock(0,0,2,2);
        Tblok.makeBlock(0,1,3,1);
        Zblok.makeBlock(0,1,2,2);
        ILblock.makeBlock(0,0,1,3);
        Nblock.makeBlock(1,0,2,2);
        specialBock.makeBlock(1,0,2,4);

        blocks.add(Lblock);
        blocks.add(LineBlock);
        blocks.add(Sblok);
        blocks.add(Tblok);
        blocks.add(Zblok);
        blocks.add(ILblock);
        blocks.add(Nblock);
        blocks.add(specialBock);
    }
}

