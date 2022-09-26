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
    //a = _printf("%x\n", "Best School"); 
    a = _printf("Can you print an address?\n%p\nNice!\n", (void *)-1);
    b = printf("Can you print an address?\n%p\nNice!\n", (void *)-1);
    printf("a: %d, b: %d\n", a, b);
    return (0);
}
