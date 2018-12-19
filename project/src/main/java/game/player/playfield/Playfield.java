package game.player.playfield;

import game.player.playfield.block.Block;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class Playfield {

    private List<List<Integer>> playfield; // hoogte 20 en breedte 10
    private Score score;
    private PointsForAbilities points;
    private Blocks blocks;


    public Blocks getBlocks() {
        return blocks;
    }

    public void setScore(Score score) {
        this.score = score;
    }

    public void setPoints(PointsForAbilities points) {
        this.points = points;
    }

    public void updateScore(int extraScore) {
        int previousScore = score.getScore();
        score.setScore(previousScore + extraScore);
    }


    public Playfield(int height, int width) {
        playfield = new ArrayList<>();
        score = new Score();
        points = new PointsForAbilities();
        blocks = new Blocks();
        makeStandardPlayfield(height,width);
    }

    private void makeStandardPlayfield(int height, int width) {
        makePlayfield(height, width);
    }

    public void makePlayfield(int height, int width) {
        for (int i = 0; i < height; i++) {
            List<Integer> playWidth = new ArrayList<>();
            for (int j = 0; j < width; j++) {
                playWidth.add(0);
            }
            playfield.add(playWidth);
        }
    }

    public List<List<Integer>> getPlayfield() {
        return Collections.unmodifiableList(playfield);
    }

    public Block newBlock() {
        Block randomBlock = new Block(blocks.getBlock());

        putOnPlayField(18, 3);
        return randomBlock;
    }

    public void putOnPlayField(int xPos, int yPos) {
        Block currentBlock = blocks.getCurrentBlock();
        if (positionAvailable(xPos, yPos, currentBlock)) {
            List<List<Integer>> block = currentBlock.getBlock();
            int newYPos = yPos;
            int newXPos = xPos;
            for (int i = block.size() - 1; i >= 0; i--) {
                for (int j = 0; j < block.get(i).size(); j++) {
                    if (block.get(i).get(j) != 0) {
                        playfield.get(newYPos).set(newXPos, 1);
                    }
                    newXPos++;
                }
                newXPos = xPos;
                newYPos++;
            }
        }
        checkForCompletedLine();
    }

    public Boolean positionAvailable(int positionX, int positionY, Block block) {
        List<List<Integer>> controlBlock = block.getBlock();
        int newYPos = positionY;
        int newXPos = positionX;
        for (int i = controlBlock.size() - 1; i >= 0; i--) {
            for (int j = 0; j < controlBlock.get(i).size(); j++) {
                if (controlBlock.get(i).get(j) != 0) {
                    if (playfield.get(newXPos).get(newYPos) == 0) {
                        newYPos++;
                    } else {
                        return false;
                    }
                }
            }
            newYPos = positionY;
            newXPos++;
        }
        return true;
    }

    public void checkForCompletedLine() {
        int amountOf1s = 0;
        int amountOfCompletedLines = 0;
        List<Integer> completedLines = new ArrayList<>();
        for (int i = 0; i < playfield.size(); i++) {
            for (int j = 0; j < playfield.get(i).size(); j++) {
                if (playfield.get(i).get(j) == 1) {
                    amountOf1s++;
                }
            }
            if (amountOf1s == 10) {
                scoreForCompletedLine();
                completedLines.add(i);
                amountOfCompletedLines++;
            }
            amountOf1s = 0;
        }

        if (amountOfCompletedLines > 1) {
            score.extraScoreForMultipleLines(amountOfCompletedLines);
        }

        removeCompletedLines(completedLines);
    }

    private void scoreForCompletedLine() {
        score.updateScore(100);
    }

    private void removeCompletedLines(List<Integer> completedLines) {
        int deleted = 0;
        for (Integer completedLine : completedLines) {
            int lineToRemove = 0;
            if (deleted > 0) {
                lineToRemove = completedLine - deleted;
            }
            playfield.remove(lineToRemove);
            int heightOfField = playfield.size();
            int widthOfField = playfield.get(heightOfField - 1).size();
            playfield.add(makeLine(widthOfField));
            deleted++;
        }
    }

    private List<Integer> makeLine(int size) {
        List<Integer> blocks = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            blocks.add(0);
        }
        return blocks;
    }

    void putLineOnField(int line, List<Integer> completeLine) {
        playfield.set(line, completeLine);
    }

    Score getScore() {
        return score;
    }


    public PointsForAbilities getPoints() {
        return points;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Playfield playfield1 = (Playfield) o;
        return Objects.equals(playfield, playfield1.playfield) &&
                Objects.equals(score, playfield1.score);
    }

    @Override
    public int hashCode() {

        return Objects.hash(playfield, score);
    }

    @Override
    public String toString() {
        return "Playfield{" + playfield +
                ", score=" + score +
                '}';
    }
}