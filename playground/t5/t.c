#include <stdio.h>
#include "main.h"
#include <stddef.h>

/**
 * main - Entry point
 *
 * Return: Always 0
 */
int main(void)
{
	int a, b;
    a = _printf("Could you print some non-prntable characters?\n%S\nThanks!\n", "Sure:\x1F\x7F\n"); 
    b = printf("%S\n", (wchar_t *)"Best\nSchool");
    _printf("a: %d, b: %d\n", a, b);
    return (0);
}
