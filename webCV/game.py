"""
JMS_SNAKE_TERMINAL - Snake game in Python terminal
Run: python game.py
"""
import curses
import random
import time

def main(stdscr):
    curses.curs_set(0)
    stdscr.nodelay(True)
    stdscr.timeout(100)

    sh, sw = stdscr.getmaxyx()

    # Game area
    w = min(40, sw - 4)
    h = min(20, sh - 4)
    start_y = (sh - h) // 2
    start_x = (sw - w) // 2

    win = curses.newwin(h, w, start_y, start_x)
    win.keypad(True)
    win.nodelay(True)
    win.timeout(100)

    # Snake
    snake = [(h // 2, w // 2), (h // 2, w // 2 - 1), (h // 2, w // 2 - 2)]
    direction = curses.KEY_RIGHT
    score = 0
    speed = 100

    # Food
    def new_food():
        while True:
            f = (random.randint(1, h - 2), random.randint(1, w - 2))
            if f not in snake:
                return f

    food = new_food()

    while True:
        win.clear()
        win.border()

        # Title
        title = f" SNAKE_HACKER | SCORE: {score} "
        win.addstr(0, (w - len(title)) // 2, title, curses.color_pair(1))

        # Food
        try:
            win.addch(food[0], food[1], '█', curses.color_pair(2))
        except:
            pass

        # Snake
        for i, (y, x) in enumerate(snake):
            try:
                if i == 0:
                    win.addch(y, x, '▓', curses.color_pair(3))
                else:
                    win.addch(y, x, '░', curses.color_pair(4))
            except:
                pass

        # Input
        key = win.getch()

        if key in [ord('q'), ord('Q')]:
            break

        if key == ord(' '):
            # Pause
            win.addstr(h // 2, (w - 8) // 2, ' PAUSED ', curses.color_pair(2))
            win.refresh()
            while True:
                if win.getch() == ord(' '):
                    break

        # Direction
        if key == curses.KEY_UP and direction != curses.KEY_DOWN:
            direction = curses.KEY_UP
        elif key == curses.KEY_DOWN and direction != curses.KEY_UP:
            direction = curses.KEY_DOWN
        elif key == curses.KEY_LEFT and direction != curses.KEY_RIGHT:
            direction = curses.KEY_LEFT
        elif key == curses.KEY_RIGHT and direction != curses.KEY_LEFT:
            direction = curses.KEY_RIGHT

        # Move
        head_y, head_x = snake[0]
        if direction == curses.KEY_UP:
            head_y -= 1
        elif direction == curses.KEY_DOWN:
            head_y += 1
        elif direction == curses.KEY_LEFT:
            head_x -= 1
        elif direction == curses.KEY_RIGHT:
            head_x += 1

        new_head = (head_y, head_x)

        # Collision
        if (head_y <= 0 or head_y >= h - 1 or
            head_x <= 0 or head_x >= w - 1 or
            new_head in snake):
            win.addstr(h // 2, (w - 20) // 2, f' GAME OVER | Score: {score} ', curses.color_pair(2))
            win.refresh()
            time.sleep(2)
            break

        snake.insert(0, new_head)

        # Eat
        if new_head == food:
            score += 10
            food = new_food()
            speed = max(50, speed - 5)
            win.timeout(speed)
        else:
            snake.pop()

        win.refresh()

    # End screen
    stdscr.clear()
    stdscr.addstr(sh // 2 - 2, (sw - 20) // 2, '══════════════════════', curses.color_pair(1))
    stdscr.addstr(sh // 2 - 1, (sw - 16) // 2, '  GAME OVER  ', curses.color_pair(2))
    stdscr.addstr(sh // 2, (sw - 16) // 2, f'  Score: {score}  ', curses.color_pair(3))
    stdscr.addstr(sh // 2 + 1, (sw - 20) // 2, '══════════════════════', curses.color_pair(1))
    stdscr.addstr(sh // 2 + 3, (sw - 10) // 2, 'Press any key', curses.color_pair(4))
    stdscr.nodelay(False)
    stdscr.getch()

if __name__ == '__main__':
    curses.wrapper(main)

