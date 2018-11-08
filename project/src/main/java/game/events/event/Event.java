package game.events.event;

public class Event {

    private String name;
    private Trigger trigger;

    public Event(String name, Trigger trigger) {
        this.name = name;
        this.trigger = trigger;
    }

    public String getName() {
        return name;
    }

    public Trigger getTrigger() {
        return trigger;
    }

    public void activate() {
        if (getTrigger() == Trigger.SCORE) {
            activateOnScore();
        } else if (getTrigger() == Trigger.TIME) {
            activateOnTime();
        }
    }

    private void activateOnTime() {

    }

    private void activateOnScore() {

    }
}