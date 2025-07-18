from manim import *

class AutoGeneratedScene(Scene):
    def construct(self):
        # Set up the scene
        self.camera.background_color = WHITE
        title = Text("DeMorgan's Laws", color=BLUE).scale(1.2).to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        # Define sets and universal set
        universe = Rectangle(width=10, height=6, color=BLACK).move_to(ORIGIN)
        set_a = Circle(radius=1.5, color=BLUE, fill_opacity=0.5).shift(LEFT * 2)
        set_b = Circle(radius=1.5, color=RED, fill_opacity=0.5).shift(RIGHT * 2)
        a_label = MathTex("A", color=BLUE).move_to(set_a.get_center())
        b_label = MathTex("B", color=RED).move_to(set_b.get_center())

        # Group sets
        sets = Group(set_a, set_b)
        labels = Group(a_label, b_label)

        # Initial display of sets
        self.play(Create(universe))
        self.play(Create(sets), Write(labels))
        self.wait(1)

        # First Law: (A ∪ B)' = A' ∩ B'
        first_law_text = MathTex(r"(A \cup B)' = A' \cap B'", color=GREEN).to_edge(DOWN)
        self.play(Write(first_law_text))
        self.wait(1)

        # Highlight A ∪ B
        union_area = Intersection(set_a, set_b, color=PURPLE, fill_opacity=0.5)
        union = Union(set_a, set_b, color=PURPLE, fill_opacity=0.5)
        self.play(Create(union))
        self.wait(1)

        # Fade out the original sets
        self.play(FadeOut(sets, labels))
        self.wait(0.5)

        # Complement of A ∪ B
        complement_area = Rectangle(width=10, height=6).move_to(ORIGIN)
        complement_area.set_fill(color=YELLOW).set_opacity(0.3)
        complement_area.set_stroke(width=0)  # Hide rectangle border
        complement_area = Difference(complement_area, union)

        self.play(FadeIn(complement_area))
        self.wait(1)

        # Transform to A' ∩ B'
        self.play(FadeOut(union, complement_area))
        self.wait(0.5)

        set_a_complement = Rectangle(width=10, height=6).move_to(ORIGIN)
        set_a_complement.set_fill(color=BLUE).set_opacity(0.3)
        set_a_complement.set_stroke(width=0)
        set_a_complement = Difference(set_a_complement, set_a.copy().set_fill(opacity=1))
        set_a_complement.move_to(ORIGIN)

        set_b_complement = Rectangle(width=10, height=6).move_to(ORIGIN)
        set_b_complement.set_fill(color=RED).set_opacity(0.3)
        set_b_complement.set_stroke(width=0)
        set_b_complement = Difference(set_b_complement, set_b.copy().set_fill(opacity=1))
        set_b_complement.move_to(ORIGIN)

        self.play(sets.animate.shift(LEFT * 2 + UP * 2), labels.animate.shift(LEFT * 2 + UP * 2))
        self.play(FadeIn(set_a_complement.move_to(set_a.get_center()).shift(DOWN * 2 + RIGHT * 2)))
        self.play(FadeIn(set_b_complement.move_to(set_b.get_center()).shift(DOWN * 2 + LEFT * 2)))
        self.wait(1)

        intersection_complement = Intersection(set_a_complement, set_b_complement).set_fill(color=ORANGE).set_opacity(0.7)
        self.play(Create(intersection_complement))
        self.wait(1)

        self.play(FadeOut(set_a_complement, set_b_complement, intersection_complement, sets, labels))
        self.wait(1)

        # Second Law: (A ∩ B)' = A' ∪ B'
        self.play(FadeOut(first_law_text))
        second_law_text = MathTex(r"(A \cap B)' = A' \cup B'", color=GREEN).to_edge(DOWN)
        self.play(Write(second_law_text))
        self.wait(1)

        self.play(sets.animate.shift(RIGHT * 2 + DOWN * 2), labels.animate.shift(RIGHT * 2 + DOWN * 2))
        self.play(FadeIn(sets, labels))
        self.wait(0.5)
        # Highlight A ∩ B
        intersection = Intersection(set_a, set_b, color=PURPLE, fill_opacity=0.5)
        self.play(Create(intersection))
        self.wait(1)

        # Complement of A ∩ B
        complement_area_2 = Rectangle(width=10, height=6).move_to(ORIGIN)
        complement_area_2.set_fill(color=YELLOW).set_opacity(0.3)
        complement_area_2.set_stroke(width=0)
        complement_area_2 = Difference(complement_area_2, intersection)
        self.play(FadeIn(complement_area_2))
        self.wait(1)
        self.play(FadeOut(intersection, complement_area_2))
        self.wait(0.5)

        # Transform to A' ∪ B'

        self.play(FadeIn(set_a_complement.move_to(set_a.get_center()).shift(DOWN * 2 + RIGHT * 2)))
        self.play(FadeIn(set_b_complement.move_to(set_b.get_center()).shift(DOWN * 2 + LEFT * 2)))
        self.wait(1)

        union_complement = Union(set_a_complement, set_b_complement).set_fill(color=ORANGE).set_opacity(0.7)
        self.play(Create(union_complement))

        self.wait(2)

        # Clean up
        self.play(FadeOut(universe, sets, labels, set_a_complement, set_b_complement, union_complement, second_law_text, title))
        self.wait(1)