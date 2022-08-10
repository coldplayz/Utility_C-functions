#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include "main.h"

/**
 * printc - prints a char
 * @arg: the char to print
 *
 * Return: the number of bytes written/printed to STDOUT
 */
int printc(char arg)
{
	int bytes_written;

	bytes_written = 0;
	write(1, c2s(arg, 0, 0), 1);
	bytes_written += 1;

	return (bytes_written);
}
